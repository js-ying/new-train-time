import CommonDialog from "@/components/common/CommonDialog";
import { useAuth } from "@/contexts/AuthContext";
import { GaEnum } from "@/enums/GaEnum";
import { gaClickEvent } from "@/utils/GaUtils";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { FC } from "react";

/**
 * Google 圖示（登入按鈕用）
 */
const GoogleIcon: FC = () => {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
};

interface UserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

/**
 * 使用者登入/帳號 Dialog
 * - 未登入：顯示「使用 Google 登入」按鈕
 * - 已登入：顯示頭像、名稱、Email、Premium 狀態、登出按鈕
 */
const UserDialog: FC<UserDialogProps> = ({ open, setOpen }) => {
  const { user, profile, loginWithGoogle, logout } = useAuth();
  const { t } = useTranslation();

  /** 處理 Google 登入 */
  const handleLogin = async () => {
    gaClickEvent(GaEnum.LOGIN_WITH_GOOGLE);
    await loginWithGoogle();
    setOpen(false);
  };

  /** 處理登出 */
  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  return (
    <CommonDialog
      open={open}
      setOpen={setOpen}
      title={t("account")}
      isDismissable={true}
    >
      {user ? (
        /* 已登入狀態 */
        <div className="flex flex-col gap-4">
          {/* 使用者資訊 */}
          <div className="flex items-center gap-3">
            {user.photoURL && (
              <Image
                src={user.photoURL}
                alt="avatar"
                width={48}
                height={48}
                className="rounded-full"
              />
            )}
            {/* 覆寫父層繼承的 [text-align-last:center]，否則單行文字會被置中 */}
            <div className="min-w-0 flex-1 text-left [text-align-last:left]">
              <p className="truncate text-sm font-semibold">
                {user.displayName}
              </p>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {user.email}
              </p>
            </div>
          </div>

          {/* 會員狀態與權益 */}
          <div className="rounded-lg border border-zinc-200 p-3 text-left [text-align-last:left] dark:border-zinc-600">
            {/* 會員稱謂：VIP 會員標橘，一般會員用一般字色 */}
            <p
              className={`text-sm font-semibold ${
                profile?.isPremium
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-zinc-700 dark:text-zinc-200"
              }`}
            >
              {profile?.isPremium ? t("premiumMember") : t("basicMember")}
            </p>
            <ul className="mt-1 list-disc pl-4 text-xs text-zinc-500 dark:text-zinc-400">
              <li>{t("syncSettingsBenefit")}</li>
              {profile?.isPremium && <li>{t("adFreeBenefit")}</li>}
            </ul>
          </div>

          {/* 登出按鈕 */}
          <div className="mx-auto w-fit">
            <Button
              onPress={handleLogout}
              size="sm"
              className="bg-transparent text-red-500 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              {t("logout")}
            </Button>
          </div>
        </div>
      ) : (
        /* 未登入狀態 */
        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogin}
            className="flex w-full items-center justify-center gap-2.5 rounded-lg
              border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium
              text-zinc-700 shadow-sm transition-all
              hover:bg-zinc-50 hover:shadow
              dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
          >
            <GoogleIcon />
            {t("loginWithGoogle")}
          </button>
        </div>
      )}
    </CommonDialog>
  );
};

export default UserDialog;
