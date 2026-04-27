import CommonDialog from "@/components/common/CommonDialog";
import { auth, googleProvider } from "@/configs/firebase";
import useDeviceDetect from "@/hooks/useDeviceDetect";
import { ApiError } from "@/models/problem-details";
import { callUserApi } from "@/services/userApi";
import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  User,
} from "firebase/auth";
import { useTranslation } from "next-i18next";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const { isIOS, isStandalone } = useDeviceDetect();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  /** 初次登入時後端錯誤（DB / 網路）→ 提示「登入失敗」 */
  const [loginError, setLoginError] = useState(false);
  /** 已登入後 token 失效（401）時觸發的提示對話框 */
  const [sessionExpired, setSessionExpired] = useState(false);

  /**
   * 由其他 user API 呼叫端通知「session 已失效」
   * 觸發強制登出 + 對話框；與初次登入失敗的 loginError 對話框分開使用
   */
  const notifySessionExpired = useCallback(() => {
    void (async () => {
      try {
        await signOut(auth);
      } catch (e) {
        console.error("signOut 失敗", e);
      }
      setUser(null);
      setProfile(null);
      setSessionExpired(true);
    })();
  }, []);

  useEffect(() => {
    // iOS PWA redirect flow 回來後要主動消化 redirect result，
    // 否則 onAuthStateChanged 雖然最終會收到登入事件，但若途中有錯誤會被吞掉
    void getRedirectResult(auth).catch((error) => {
      console.error("getRedirectResult 失敗", error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      // iOS standalone PWA 必須走 redirect flow（popup 帶不回 session）；
      // 其他環境維持 popup 體驗，避免整頁 reload 打斷使用者操作
      if (isIOS && isStandalone) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    try {
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
