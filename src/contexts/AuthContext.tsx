import CommonDialog from "@/components/common/CommonDialog";
import Loading from "@/components/common/Loading";
import {
  hasPendingRedirect,
  isFirebaseAuthLoaded,
  loadFirebaseAuth,
  mayHaveStoredSession,
} from "@/configs/firebase";
import useDeviceDetect from "@/hooks/useDeviceDetect";
import type { MembershipPlanCode, MembershipState } from "@/models/membership";
import { ApiError } from "@/models/problem-details";
import {
  callUserApi,
  createSession,
  deleteSession,
  hasSessionHint,
} from "@/services/userApi";
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

/** 已登入的會員身分（取自後端 /me） */
export interface AuthUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoUrl: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
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
   * 會清掉登入狀態並彈出「登入已失效」對話框
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

/** /me 回應轉成 AuthUser */
const toUser = (data: MeResponse): AuthUser => ({
  uid: data.uid,
  email: data.email,
  displayName: data.displayName,
  photoUrl: data.photoUrl,
});

/** 兩個 AuthUser 內容是否相同（相同就沿用舊物件，避免依賴 user 的 effect 重跑） */
const isSameUser = (a: AuthUser, b: AuthUser) =>
  a.uid === b.uid &&
  a.email === b.email &&
  a.displayName === b.displayName &&
  a.photoUrl === b.photoUrl;

/** 取 /me 的三種結果：invalid 才可登出，unavailable 必須保留登入狀態 */
type MeOutcome =
  | { kind: "ok"; me: MeResponse }
  | { kind: "invalid" }
  | { kind: "unavailable" };

/** 以 session cookie 取 /me；後端 5xx / 網路瞬斷一律歸 unavailable */
const loadMe = async (): Promise<MeOutcome> => {
  try {
    const me = await callUserApi<MeResponse>({
      url: "/api/users/me",
      method: "GET",
    });
    return { kind: "ok", me };
  } catch (error) {
    return isAuthError(error) ? { kind: "invalid" } : { kind: "unavailable" };
  }
};

/**
 * 以 Firebase 登入換發 session cookie 後取 /me。
 * ID token 被拒時強制換發一次再試（背景分頁久置會讓 SDK 送出過期 token）。
 */
const exchangeSession = async (
  fbUser: User,
  source: "login" | "migrate",
): Promise<MeOutcome> => {
  for (const forceRefresh of [false, true]) {
    try {
      await createSession(await fbUser.getIdToken(forceRefresh), source);
      return await loadMe();
    } catch (error) {
      if (isAuthError(error)) {
        if (forceRefresh) return { kind: "invalid" };
        continue;
      }
      // 換發 ID token 失敗時拋的是 FirebaseError；除連線問題外都代表 refresh token 已不可用
      const code = (error as { code?: unknown })?.code;
      const isFirebaseAuthFailure =
        typeof code === "string" &&
        code.startsWith("auth/") &&
        code !== "auth/network-request-failed";
      return isFirebaseAuthFailure ? { kind: "invalid" } : { kind: "unavailable" };
    }
  }
  return { kind: "invalid" };
};

/** 後端暫時不可用時的重試間隔（指數退避） */
const RETRY_BASE_MS = 5000;
const RETRY_MAX_MS = 60000;

/** 延後多久才申請持久化儲存：Firefox 會跳權限提示，避免與登入 Loading 覆蓋層重疊 */
const PERSIST_REQUEST_DELAY_MS = 2000;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/**
 * 申請持久化儲存，避免本機的登入與收藏資料被瀏覽器當可丟棄資料清掉。
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
  const [user, setUserState] = useState<AuthUser | null>(null);
  /** 同 user，供非同步流程讀取最新值 */
  const userRef = useRef<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  /** Google 登入流程中（按下登入鍵 → 換發 session 完成）顯示全螢幕 Loading 覆蓋 */
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  /** 同 isLoggingIn，供 onAuthStateChanged callback 讀取（state 閉包拿不到最新值） */
  const isLoggingInRef = useRef(false);
  /** 初次登入時後端錯誤（DB / 網路）→ 提示「登入失敗」 */
  const [loginError, setLoginError] = useState(false);
  /** 已登入後 session 失效（401）時觸發的提示對話框 */
  const [sessionExpired, setSessionExpired] = useState(false);
  /** Provider 是否仍掛載；重試迴圈據此停止 */
  const aliveRef = useRef(true);
  const persistRequestTimerRef = useRef<number>();

  /** 更新登入者；內容不變時沿用舊物件 */
  const setUser = useCallback((next: AuthUser | null) => {
    const prev = userRef.current;
    if (prev && next && isSameUser(prev, next)) return;
    userRef.current = next;
    setUserState(next);
  }, []);

  /** 套用 /me 結果並申請持久化儲存 */
  const applyMe = useCallback(
    (me: MeResponse) => {
      setUser(toUser(me));
      setProfile(toProfile(me));
      window.clearTimeout(persistRequestTimerRef.current);
      persistRequestTimerRef.current = window.setTimeout(
        () => void requestPersistentStorage(),
        PERSIST_REQUEST_DELAY_MS,
      );
    },
    [setUser],
  );

  /** 後端暫時不可用就退避重試，直到結果確定；Provider 卸載則回 null */
  const untilSettled = useCallback(
    async (
      attempt: () => Promise<MeOutcome>,
    ): Promise<Exclude<MeOutcome, { kind: "unavailable" }> | null> => {
      for (let delay = RETRY_BASE_MS; ; delay = Math.min(delay * 2, RETRY_MAX_MS)) {
        const outcome = await attempt();
        if (!aliveRef.current) return null;
        if (outcome.kind !== "unavailable") return outcome;
        console.error("取得使用者資料失敗，稍後重試");
        await sleep(delay);
        if (!aliveRef.current) return null;
      }
    },
    [],
  );

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

  /**
   * 載入 firebase/auth 並訂閱登入狀態（重複呼叫共用同一個訂閱）。
   * 由使用者準備登入、redirect 導回、或既有 Firebase 登入需轉移成 session 時觸發；
   * SDK 回報已登入且尚未以 session 登入時，換發 session cookie。
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

        session.unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
          try {
            if (fbUser && userRef.current?.uid !== fbUser.uid) {
              // 使用者主動登入：失敗即提示；既有登入轉移：後端暫時不可用就背景重試
              const isLogin = isLoggingInRef.current || pendingRedirect;
              const outcome = isLogin
                ? await exchangeSession(fbUser, "login")
                : await untilSettled(() => exchangeSession(fbUser, "migrate"));
              if (session.cancelled || outcome === null) return;
              if (outcome.kind === "ok") {
                applyMe(outcome.me);
              } else {
                // 憑證失效、或主動登入當下就失敗 → 登出 Firebase；後者額外提示
                await signOut(auth);
                if (outcome.kind === "unavailable") setLoginError(true);
              }
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
    [applyMe, ensureAuth, untilSettled],
  );

  /**
   * 使用者即將看到登入按鈕時預先載入：popup 須在點擊當下開窗，
   * 等點下去才載 SDK / auth iframe 可能超過瀏覽器的使用者手勢時效而被擋。
   */
  const prepareLogin = useCallback(() => {
    void startAuthListener(true);
  }, [startAuthListener]);

  /** 清除登入：session cookie 與 Firebase 登入都要清，否則下次開站會被轉移流程登回去 */
  const clearLogin = useCallback(async () => {
    await deleteSession();
    try {
      if (isFirebaseAuthLoaded() || (await mayHaveStoredSession())) {
        const [{ auth }, { signOut }] = await Promise.all([
          ensureAuth(),
          import("firebase/auth"),
        ]);
        await signOut(auth);
      }
    } catch (error) {
      console.error("signOut 失敗", error);
    }
    setUser(null);
    setProfile(null);
  }, [ensureAuth, setUser]);

  /**
   * 由其他 user API 呼叫端通知「session 已失效」
   * 觸發強制登出 + 對話框；與初次登入失敗的 loginError 對話框分開使用
   */
  const notifySessionExpired = useCallback(() => {
    void (async () => {
      await clearLogin();
      setSessionExpired(true);
    })();
  }, [clearLogin]);

  /**
   * 重新拉 /me 更新 profile（付款導回頁解鎖 UI 用）。
   * 失敗只 log 不強制登出（導回頁可能 webhook 還沒回來，使用者可手動再刷）。
   */
  const refreshProfile = useCallback(async () => {
    if (!userRef.current) return;
    const outcome = await loadMe();
    if (outcome.kind === "ok") {
      applyMe(outcome.me);
    } else {
      console.error("refreshProfile 失敗", outcome.kind);
    }
  }, [applyMe]);

  useEffect(() => {
    aliveRef.current = true;

    // 有登入提示 cookie 直接取 /me；否則只有 redirect 導回或本機存有 Firebase 登入才載 SDK
    const cancelIdle = scheduleIdle(() => {
      void (async () => {
        if (hasPendingRedirect()) {
          void startAuthListener();
          return;
        }
        if (hasSessionHint()) {
          const outcome = await untilSettled(loadMe);
          if (outcome === null) return;
          if (outcome.kind === "ok") {
            applyMe(outcome.me);
            setLoading(false);
            return;
          }
          // session 已失效：清掉殘留的提示 cookie，再看是否有 Firebase 登入可轉移
          await deleteSession();
        }
        const hasStoredSession = await mayHaveStoredSession();
        if (!aliveRef.current) return;
        if (hasStoredSession) {
          void startAuthListener();
        } else {
          setLoading(false);
        }
      })();
    });

    return () => {
      aliveRef.current = false;
      cancelIdle();
      window.clearTimeout(persistRequestTimerRef.current);
      const session = listenerRef.current;
      if (session) {
        session.cancelled = true;
        session.unsubscribe?.();
        listenerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 依賴皆為穩定 useCallback；
    // 列入依賴會讓 dev StrictMode 多跑 effect 與多次 onAuthStateChanged 訂閱
  }, []);

  const loginWithGoogle = async () => {
    try {
      const { auth, provider } = await ensureAuth(true);
      // 先等初始的登入狀態回呼跑完，才不會把下面的登入中旗標收掉
      await startAuthListener(true);
      // 標記為使用者主動發起：onAuthStateChanged 對「登入當下就換發失敗」改採登出 + 提示
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
      // popup 成功授權後才顯示 Loading，覆蓋「視野回到網頁 → 換發 session 取回 profile」之間的等待
      setIsLoggingIn(true);
    } catch (error) {
      isLoggingInRef.current = false;
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    try {
      await clearLogin();
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

      {/* 已登入後 session 失效（401）時的提示彈窗 */}
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
