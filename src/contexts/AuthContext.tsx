import CommonDialog from "@/components/common/CommonDialog";
import Loading from "@/components/common/Loading";
import {
  hasPendingRedirect,
  loadFirebaseAuth,
  mayHaveStoredSession,
} from "@/configs/firebase";
import useDeviceDetect from "@/hooks/useDeviceDetect";
import type { MembershipPlanCode, MembershipState } from "@/models/membership";
import { ApiError } from "@/models/problem-details";
import { callUserApi } from "@/services/userApi";
import type { User } from "firebase/auth";
import { useTranslation } from "next-i18next";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface UserProfile {
  /** 會員是否有效（後端計算，是去廣告等權益的唯一判定） */
  isPremium: boolean;
  /** ISO 到期日（含 +08:00）；供到期 modal 判斷距到期天數 */
  premiumUntil: string | null;
  /** none=從未付費；active=會員有效；expired=曾付費已過期 */
  membershipStatus: MembershipState;
  /** 最近一筆已付款方案；無則 null */
  lastPlan: MembershipPlanCode | null;
  /** 顯示名稱；password 註冊使用者可能為 null */
  displayName: string | null;
  /** 頭像 URL；僅社群登入會帶 */
  photoUrl: string | null;
  /** 登入方式：google.com / password / apple.com 等 */
  signInProvider: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  /** 即將顯示登入按鈕時呼叫，預先載入登入所需模組 */
  prepareLogin: () => void;
  logout: () => Promise<void>;
  setProfile: (profile: UserProfile | null) => void;
  /** 重新向後端拉 /me 並更新 profile（付款導回後解鎖 UI 用）；無登入則略過 */
  refreshProfile: () => Promise<void>;
  /**
   * 由 user API 呼叫端在收到 401 (UNAUTHORIZED / INVALID_TOKEN) 時呼叫，
   * 會清掉 Firebase session 並彈出「登入已失效」對話框
   */
  notifySessionExpired: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  loginWithGoogle: async () => {},
  prepareLogin: () => {},
  logout: async () => {},
  setProfile: () => {},
  refreshProfile: async () => {},
  notifySessionExpired: () => {},
});

export const useAuth = () => useContext(AuthContext);

/** active 為 true（如登入提示彈窗開啟）時預先載入登入模組 */
export const usePrepareLogin = (active: boolean) => {
  const { prepareLogin } = useAuth();
  useEffect(() => {
    if (active) prepareLogin();
  }, [active, prepareLogin]);
};

/**
 * 判斷錯誤是否為「登入憑證問題」：UNAUTHORIZED 或 INVALID_TOKEN
 * 統一給 user API 呼叫端使用，避免各處重複比對 code 字串
 */
export const isAuthError = (err: unknown): err is ApiError =>
  err instanceof ApiError &&
  (err.code === "UNAUTHORIZED" || err.code === "INVALID_TOKEN");

/**
 * 登入狀態檢查延到 idle 之後，避開首屏 main-thread 競爭。
 * - 不支援 requestIdleCallback 的環境（Safari）退回 setTimeout 200ms。
 */
const scheduleIdle = (cb: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};
  const w = window as Window &
    typeof globalThis & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
  if (typeof w.requestIdleCallback === "function") {
    const handle = w.requestIdleCallback(cb, { timeout: 1500 });
    return () => w.cancelIdleCallback?.(handle);
  }
  const handle = window.setTimeout(cb, 200);
  return () => window.clearTimeout(handle);
};

/** 後端 /api/users/me 的回應契約 */
interface MeResponse {
  uid: string;
  email: string;
  isPremium: boolean;
  premiumUntil: string | null;
  status: MembershipState;
  lastPlan: MembershipPlanCode | null;
  displayName: string | null;
  photoUrl: string | null;
  signInProvider: string | null;
}

/** /me 回應轉成 context 用的 UserProfile */
const toProfile = (data: MeResponse): UserProfile => ({
  isPremium: data.isPremium,
  premiumUntil: data.premiumUntil,
  membershipStatus: data.status,
  lastPlan: data.lastPlan,
  displayName: data.displayName,
  photoUrl: data.photoUrl,
  signInProvider: data.signInProvider,
});

const fetchMe = (user: User) =>
  callUserApi<MeResponse>({ url: "/api/users/me", method: "GET", user });

/** 取 profile 的三種結果：invalid 才可登出，unavailable 必須保留登入狀態 */
type MeOutcome =
  | { kind: "ok"; profile: UserProfile }
  | { kind: "invalid" }
  | { kind: "unavailable" };

/** 暫時取不到 profile 時，延遲多久在背景補拉一次 */
const PROFILE_RETRY_DELAY_MS = 5000;

/** 延後多久才申請持久化儲存：Firefox 會跳權限提示，避免與登入 Loading 覆蓋層重疊 */
const PERSIST_REQUEST_DELAY_MS = 2000;

/**
 * 取 /me；憑證錯誤先強制換發 ID token 再試一次（背景分頁久置會讓 SDK 送出過期 token），
 * 換發後仍被拒才算憑證失效。後端 5xx / 網路瞬斷一律歸 unavailable。
 */
const loadMe = async (user: User): Promise<MeOutcome> => {
  try {
    return { kind: "ok", profile: toProfile(await fetchMe(user)) };
  } catch (error) {
    if (!isAuthError(error)) return { kind: "unavailable" };
  }
  try {
    await user.getIdToken(true);
    return { kind: "ok", profile: toProfile(await fetchMe(user)) };
  } catch (retryError) {
    if (isAuthError(retryError)) return { kind: "invalid" };
    // 換發失敗時拋的是 FirebaseError；除連線問題外都代表 refresh token 已不可用
    const code = (retryError as { code?: unknown })?.code;
    const isFirebaseAuthFailure =
      typeof code === "string" &&
      code.startsWith("auth/") &&
      code !== "auth/network-request-failed";
    return isFirebaseAuthFailure ? { kind: "invalid" } : { kind: "unavailable" };
  }
};

/**
 * 申請持久化儲存，避免 Firebase session 所在的 IndexedDB 被瀏覽器當可丟棄資料清掉。
 * 授予與否由瀏覽器決定，不支援或被拒都不影響登入流程。
 */
const requestPersistentStorage = async (): Promise<void> => {
  try {
    if (!navigator.storage?.persist) return;
    if (await navigator.storage.persisted()) return;
    await navigator.storage.persist();
  } catch {
    // 隱私模式等環境呼叫即 throw，忽略
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const { isAppleMobile, isStandalone } = useDeviceDetect();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  /** Google 登入流程中（按下登入鍵 → onAuthStateChanged 處理完）顯示全螢幕 Loading 覆蓋 */
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  /** 同 isLoggingIn，供 onAuthStateChanged callback 讀取（state 閉包拿不到最新值） */
  const isLoggingInRef = useRef(false);
  /** 初次登入時後端錯誤（DB / 網路）→ 提示「登入失敗」 */
  const [loginError, setLoginError] = useState(false);
  /** 已登入後 token 失效（401）時觸發的提示對話框 */
  const [sessionExpired, setSessionExpired] = useState(false);

  /** 取得 firebase auth + provider（全頁單例）；forLogin 只在首次初始化時生效，見 loadFirebaseAuth */
  const ensureAuth = useCallback(
    (forLogin = false) =>
      loadFirebaseAuth({ forLogin }).then(({ auth, googleProvider }) => ({
        auth,
        provider: googleProvider,
      })),
    [],
  );

  /** 目前的 onAuthStateChanged 訂閱；ready 在第一次回呼處理完後 resolve */
  const listenerRef = useRef<{
    cancelled: boolean;
    unsubscribe?: () => void;
    ready: Promise<void>;
  } | null>(null);
  const profileRetryTimerRef = useRef<number>();
  const persistRequestTimerRef = useRef<number>();

  /**
   * 載入 firebase/auth 並訂閱登入狀態（重複呼叫共用同一個訂閱）。
   * 由 idle 時偵測到既有 session、或使用者準備登入時觸發。
   */
  const startAuthListener = useCallback(
    (forLogin = false): Promise<void> => {
      if (listenerRef.current) return listenerRef.current.ready;
      let markReady = () => {};
      const session: NonNullable<typeof listenerRef.current> = {
        cancelled: false,
        ready: new Promise<void>((resolve) => {
          markReady = resolve;
        }),
      };
      listenerRef.current = session;

      void (async () => {
        // SDK 初始化時會清掉 pendingRedirect 旗標，須先讀
        const pendingRedirect = hasPendingRedirect();
        // 一律走 ensureAuth，避免與 loginWithGoogle 並發時各自 new GoogleAuthProvider()
        // 造成 firebase _assertInstanceOf 對不上
        const [
          { auth },
          {
            browserPopupRedirectResolver,
            getRedirectResult,
            onAuthStateChanged,
            signOut,
          },
        ] = await Promise.all([ensureAuth(forLogin), import("firebase/auth")]);
        if (session.cancelled) return;

        // iOS PWA redirect flow 回來後要主動消化 redirect result，
        // 否則 onAuthStateChanged 雖然最終會收到登入事件，但若途中有錯誤會被吞掉
        if (pendingRedirect) {
          void getRedirectResult(auth, browserPopupRedirectResolver).catch(
            (error) => {
              console.error("getRedirectResult 失敗", error);
            },
          );
        }

        session.unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          try {
            if (currentUser) {
              const outcome = await loadMe(currentUser);
              if (outcome.kind === "ok") {
                setProfile(outcome.profile);
                setUser(currentUser);
                window.clearTimeout(persistRequestTimerRef.current);
                persistRequestTimerRef.current = window.setTimeout(
                  () => void requestPersistentStorage(),
                  PERSIST_REQUEST_DELAY_MS,
                );
              } else if (outcome.kind === "invalid" || isLoggingInRef.current) {
                // 憑證確定失效、或使用者主動登入的當下就失敗 → 登出；
                // 後者額外提示，避免停在「按了登入卻沒有會員資料」的半完成狀態
                await signOut(auth);
                setUser(null);
                setProfile(null);
                if (outcome.kind === "unavailable") setLoginError(true);
              } else {
                // 後端暫時不可用：保留登入狀態，profile 留空並於稍後背景補拉
                console.error("取得使用者資料失敗，保留登入狀態");
                setUser(currentUser);
                setProfile(null);
                profileRetryTimerRef.current = window.setTimeout(() => {
                  void fetchMe(currentUser)
                    .then((data) => {
                      if (!session.cancelled) setProfile(toProfile(data));
                    })
                    .catch(() => {});
                }, PROFILE_RETRY_DELAY_MS);
              }
            } else {
              setUser(null);
              setProfile(null);
            }
            setLoading(false);
            // 不論成功失敗，都把登入中覆蓋層收掉（包含 popup 流程結束、redirect 回來、登出）
            isLoggingInRef.current = false;
            setIsLoggingIn(false);
          } finally {
            markReady();
          }
        });
      })().catch((error) => {
        // chunk 載入失敗：釋放訂閱槽位讓下次可重試，並結束 loading 以訪客狀態顯示
        console.error("載入登入模組失敗", error);
        if (listenerRef.current === session) listenerRef.current = null;
        setLoading(false);
        markReady();
      });

      return session.ready;
    },
    [ensureAuth],
  );

  /**
   * 使用者即將看到登入按鈕時預先載入：popup 須在點擊當下開窗，
   * 等點下去才載 SDK / auth iframe 可能超過瀏覽器的使用者手勢時效而被擋。
   */
  const prepareLogin = useCallback(() => {
    void startAuthListener(true);
  }, [startAuthListener]);

  /**
   * 由其他 user API 呼叫端通知「session 已失效」
   * 觸發強制登出 + 對話框；與初次登入失敗的 loginError 對話框分開使用
   */
  const notifySessionExpired = useCallback(() => {
    void (async () => {
      try {
        const { auth } = await ensureAuth();
        const { signOut } = await import("firebase/auth");
        await signOut(auth);
      } catch (e) {
        console.error("signOut 失敗", e);
      }
      setUser(null);
      setProfile(null);
      setSessionExpired(true);
    })();
  }, [ensureAuth]);

  /**
   * 重新拉 /me 更新 profile（付款導回頁解鎖 UI 用）。
   * 失敗只 log 不強制登出（導回頁可能 webhook 還沒回來，使用者可手動再刷）。
   */
  const refreshProfile = useCallback(async () => {
    try {
      const { auth } = await ensureAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      setProfile(toProfile(await fetchMe(currentUser)));
    } catch (error) {
      console.error("refreshProfile 失敗", error);
    }
  }, [ensureAuth]);

  useEffect(() => {
    let cancelled = false;

    // 本機沒有 session 的訪客不載入 firebase/auth，直接以未登入狀態結束 loading
    const cancelIdle = scheduleIdle(() => {
      void (async () => {
        const hasSession =
          hasPendingRedirect() || (await mayHaveStoredSession());
        if (cancelled) return;
        if (hasSession) {
          void startAuthListener();
        } else {
          setLoading(false);
        }
      })();
    });

    return () => {
      cancelled = true;
      cancelIdle();
      window.clearTimeout(profileRetryTimerRef.current);
      window.clearTimeout(persistRequestTimerRef.current);
      const session = listenerRef.current;
      if (session) {
        session.cancelled = true;
        session.unsubscribe?.();
        listenerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- startAuthListener 為穩定 useCallback；
    // 列入依賴會讓 dev StrictMode 多跑 effect 與多次 onAuthStateChanged 訂閱
  }, []);

  const loginWithGoogle = async () => {
    try {
      const { auth, provider } = await ensureAuth(true);
      // 先等初始的登入狀態回呼跑完，才不會把下面的登入中旗標收掉
      await startAuthListener(true);
      // 標記為使用者主動發起：onAuthStateChanged 對「登入當下就取不到 profile」改採登出 + 提示
      isLoggingInRef.current = true;
      const {
        browserPopupRedirectResolver,
        signInWithPopup,
        signInWithRedirect,
      } = await import("firebase/auth");
      // Apple 手機 PWA 必須走 redirect flow（popup 帶不回 session）；
      // 其他環境維持 popup 體驗，避免整頁 reload 打斷使用者操作
      if (isAppleMobile && isStandalone) {
        await signInWithRedirect(auth, provider, browserPopupRedirectResolver);
        return;
      }
      try {
        // 注意：Loading 覆蓋層延後到 popup resolve 之後才開啟，避免使用者取消授權時，
        // Firebase 透過 polling 偵測 popup 關閉會多花 1~2 秒才 reject，造成 Loading 卡住
        await signInWithPopup(auth, provider, browserPopupRedirectResolver);
      } catch (error) {
        // auth iframe 未預載（如同頁登出後再登入）時，開窗可能超過手勢時效被擋 → 改走 redirect
        if ((error as { code?: unknown })?.code !== "auth/popup-blocked") {
          throw error;
        }
        await signInWithRedirect(auth, provider, browserPopupRedirectResolver);
        return;
      }
      // popup 成功授權後才顯示 Loading，覆蓋「視野回到網頁 → onAuthStateChanged 取回 profile」之間的等待
      setIsLoggingIn(true);
    } catch (error) {
      isLoggingInRef.current = false;
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    try {
      const { auth } = await ensureAuth();
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        loginWithGoogle,
        prepareLogin,
        logout,
        setProfile,
        refreshProfile,
        notifySessionExpired,
      }}
    >
      {children}

      {/* 登入流程中的全螢幕 Loading：popup 關閉後到 profile 取回前，避免畫面看起來卡住 */}
      {isLoggingIn && <Loading />}

      {/* 後端異常導致登入失敗時的錯誤提示彈窗 */}
      <CommonDialog open={loginError} setOpen={setLoginError}>
        {t("loginServerErrorMsg")}
      </CommonDialog>

      {/* 已登入後 token 失效（401）時的提示彈窗 */}
      <CommonDialog
        open={sessionExpired}
        setOpen={setSessionExpired}
        title="sessionExpiredTitle"
      >
        {t("sessionExpiredMsg")}
      </CommonDialog>
    </AuthContext.Provider>
  );
};
