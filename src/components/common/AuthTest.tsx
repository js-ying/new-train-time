import { useAuth } from "@/contexts/AuthContext";
import { FC, useState } from "react";

const AuthTest: FC = () => {
  const { user, profile, loading, loginWithGoogle, logout, setProfile } =
    useAuth();
  const [isPremiumMock, setIsPremiumMock] = useState(false);

  // 提供一個強制開啟「付費身份」的在地測試按鈕 (不依賴後端)
  const togglePremium = () => {
    const newStatus = !isPremiumMock;
    setIsPremiumMock(newStatus);
    if (profile) {
      setProfile({ ...profile, isPremium: newStatus });
    }
  };

  if (loading) return <div>Loading Auth...</div>;

  return (
    <div className="fixed right-4 top-4 z-50 rounded-lg border border-zinc-200 bg-white p-4 shadow dark:border-zinc-700 dark:bg-zinc-800">
      <h3 className="mb-2 font-bold">Auth Test Panel</h3>
      {user ? (
        <div>
          <p className="text-sm">Hi, {user.displayName}</p>
          <p className="w-32 truncate text-sm">{user.email}</p>
          <div className="mt-2 text-sm">
            Status:{" "}
            {profile?.isPremium || isPremiumMock ? "👑 Premium" : "Basic"}
            <button
              onClick={togglePremium}
              className="ml-2 rounded bg-blue-500 px-2 py-1 text-xs text-white"
            >
              Toggle VIP
            </button>
          </div>
          <button
            onClick={logout}
            className="mt-3 w-full rounded bg-red-500 px-3 py-1 text-sm text-white transition-colors hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={loginWithGoogle}
          className="w-full rounded bg-blue-500 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-600"
        >
          Sign In w/ Google
        </button>
      )}
    </div>
  );
};

export default AuthTest;
