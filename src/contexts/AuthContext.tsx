import CommonDialog from "@/components/common/CommonDialog";
import { auth, googleProvider } from "@/configs/firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { useTranslation } from "next-i18next";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserProfile {
  isPremium: boolean;
  // TODO: 加入其他未來需要的資訊
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setProfile: (profile: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  loginWithGoogle: async () => {},
  logout: async () => {},
  setProfile: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState(false);

  /**
   * 取得使用者額外資料（從我們的後端拿 is_premium）
   * 若後端回應非 2xx（例如 DB 連線異常），會拋出例外
   */
  const fetchUserProfile = async (firebaseUser: User) => {
    // 取得 ID token 來跟後端驗證與換取資料
    const token = await firebaseUser.getIdToken();

    const res = await fetch("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 後端回應非 2xx 時（如 DB 連線異常回 500），視為失敗並拋出例外
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(
        errorBody.message || `後端回應錯誤 (HTTP ${res.status})`,
      );
    }

    const data = await res.json();
    setProfile({ isPremium: data.isPremium });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          await fetchUserProfile(currentUser);
          setUser(currentUser);
        } catch (error) {
          // 後端 DB 異常時，登出 Firebase 並顯示錯誤彈窗
          console.error("後端使用者資料取得失敗，強制登出 Firebase", error);
          await signOut(auth);
          setUser(null);
          setProfile(null);
          setLoginError(true);
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
      value={{ user, profile, loading, loginWithGoogle, logout, setProfile }}
    >
      {children}

      {/* 後端異常導致登入失敗時的錯誤提示彈窗 */}
      <CommonDialog open={loginError} setOpen={setLoginError}>
        {t("loginServerErrorMsg")}
      </CommonDialog>
    </AuthContext.Provider>
  );
};
