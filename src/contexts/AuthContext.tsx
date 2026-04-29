import CommonDialog from "@/components/common/CommonDialog";
import Loading from "@/components/common/Loading";
import { loadFirebaseAuth } from "@/configs/firebase";
import useDeviceDetect from "@/hooks/useDeviceDetect";
import { ApiError } from "@/models/problem-details";
import { callUserApi } from "@/services/userApi";
import type { Auth, GoogleAuthProvider, User } from "firebase/auth";
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
  isPremium: boolean;
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
  logout: () => Promise<void>;
  setProfile: (profile: UserProfile | null) => void;
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
  logout: async () => {},
  setProfile: () => {},
  notifySessionExpired: () => {},
});

export const useAuth = () => useContext(AuthContext);

/**
 * 判斷錯誤是否為「登入憑證問題」：UNAUTHORIZED 或 INVALID_TOKEN
 * 統一給 user API 呼叫端使用，避免各處重複比對 code 字串
 */
export const isAuthError = (err: unknown): err is ApiError =>
  err instanceof ApiError &&
  (err.code === "UNAUTHORIZED" || err.code === "INVALID_TOKEN");

/**
 * 把 firebase/auth 抽到 idle 之後才載入：
 * - 在 idle callback 執行 dynamic import('firebase/auth')，避開首屏 main-thread 競爭。
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const { isIOS, isStandalone } = useDeviceDetect();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  /** Google 登入流程中（按下登入鍵 → onAuthStateChanged 處理完）顯示全螢幕 Loading 覆蓋 */
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  /** 初次登入時後端錯誤（DB / 網路）→ 提示「登入失敗」 */
  const [loginError, setLoginError] = useState(false);
  /** 已登入後 token 失效（401）時觸發的提示對話框 */
  const [sessionExpired, setSessionExpired] = useState(false);

  // 持有當前的 firebase auth / provider；在 idle 載入後填入，登入/登出/notifySessionExpired 共用
  const authRef = useRef<Auth | null>(null);
  const providerRef = useRef<GoogleAuthProvider | null>(null);
  // 單例 promise：避免 idle callback 與使用者點擊登入並發時，各自跑一次 loadFirebaseAuth、
  // 產生兩個不同的 GoogleAuthProvider 實例（造成 _assertInstanceOf 對不上）
  const ensureAuthPromiseRef = useRef<Promise<{
    auth: Auth;
    provider: GoogleAuthProvider;
  }> | null>(null);

  /**
   * 確保 firebase auth chunk 已載入並回傳 auth + provider 實例。
   * 任何路徑（idle 預載 / 登入按鈕 / 登出 / session 失效）統一走這支，
   * 避免「authRef 有值但 providerRef 還是 null」的中間狀態。
   */
  const ensureAuth = useCallback(async () => {
    if (authRef.current && providerRef.current) {
      return { auth: authRef.current, provider: providerRef.current };
    }
    if (!ensureAuthPromiseRef.current) {
      ensureAuthPromiseRef.current = loadFirebaseAuth().then(
        ({ auth, googleProvider }) => {
          authRef.current = auth;
          providerRef.current = googleProvider;
          return { auth, provider: googleProvider };
        },
      );
    }
    return ensureAuthPromiseRef.current;
  }, []);

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

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    const cancelIdle = scheduleIdle(() => {
      void (async () => {
        // 一律走 ensureAuth，由它統一管理 ref 與 dedupe，避免與後續 loginWithGoogle 並發時
        // 各自 new GoogleAuthProvider() 造成 firebase _assertInstanceOf 對不上
        const [{ auth }, { getRedirectResult, onAuthStateChanged, signOut }] =
          await Promise.all([ensureAuth(), import("firebase/auth")]);
        if (cancelled) return;

        // iOS PWA redirect flow 回來後要主動消化 redirect result，
        // 否則 onAuthStateChanged 雖然最終會收到登入事件，但若途中有錯誤會被吞掉
        void getRedirectResult(auth).catch((error) => {
          console.error("getRedirectResult 失敗", error);
        });

        unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          if (currentUser) {
            try {
              const data = await callUserApi<{
                uid: string;
                email: string;
                isPremium: boolean;
                displayName: string | null;
                photoUrl: string | null;
                signInProvider: string | null;
              }>({
                url: "/api/users/me",
                method: "GET",
                user: currentUser,
              });
              setProfile({
                isPremium: data.isPremium,
                displayName: data.displayName,
                photoUrl: data.photoUrl,
                signInProvider: data.signInProvider,
              });
              setUser(currentUser);
            } catch (error) {
              // 初次取得 profile 就失敗：登出 firebase 並顯示提示
              // 401 類錯誤靜默登出（多半是帳號被停用），其他錯誤彈出 loginServerErrorMsg
              console.error("後端使用者資料取得失敗，強制登出 Firebase", error);
              await signOut(auth);
              setUser(null);
              setProfile(null);
              if (!isAuthError(error)) {
                setLoginError(true);
              }
            }
          } else {
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
          // 不論成功失敗，都把登入中覆蓋層收掉（包含 popup 流程結束、redirect 回來、登出）
          setIsLoggingIn(false);
        });
      })();
    });

    return () => {
      cancelled = true;
      cancelIdle();
      unsubscribe?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ensureAuth 為穩定 useCallback；
    // 列入依賴會讓 dev StrictMode 多跑 effect 與多次 onAuthStateChanged 訂閱
  }, []);

  const loginWithGoogle = async () => {
    try {
      const { auth, provider } = await ensureAuth();
      const { signInWithPopup, signInWithRedirect } = await import(
        "firebase/auth"
      );
      // iOS standalone PWA 必須走 redirect flow（popup 帶不回 session）；
      // 其他環境維持 popup 體驗，避免整頁 reload 打斷使用者操作
      if (isIOS && isStandalone) {
        await signInWithRedirect(auth, provider);
        return;
      }
      // 注意：Loading 覆蓋層延後到 popup resolve 之後才開啟，避免使用者取消授權時，
      // Firebase 透過 polling 偵測 popup 關閉會多花 1~2 秒才 reject，造成 Loading 卡住
      await signInWithPopup(auth, provider);
      // popup 成功授權後才顯示 Loading，覆蓋「視野回到網頁 → onAuthStateChanged 取回 profile」之間的等待
      setIsLoggingIn(true);
    } catch (error) {
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
        logout,
        setProfile,
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
