import UserDialog from "@/components/common/UserDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "next-i18next";
import { FC, useState } from "react";

/**
 * 使用者頭像圖示（未登入時顯示的 SVG icon）
 */
const UserIcon: FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
};

/**
 * 使用者頭像按鈕（右上角）
 * - 未登入：顯示用戶 icon，點擊開啟 UserDialog
 * - 已登入：顯示 Google 頭像，點擊開啟 UserDialog
 */
const UserAvatar: FC = () => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);

  // 認證正在載入時不顯示任何內容，避免閃爍
  if (loading) return null;

  return (
    <>
      {/* 頭像 / 登入按鈕 */}
      <div
        tabIndex={0}
        role="button"
        aria-label={user ? t("account") : t("login")}
        className="custom-cursor-pointer inline-block"
        onClick={() => setDialogOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setDialogOpen(true);
          }
        }}
      >
        <UserIcon />
      </div>

      {/* 使用者 Dialog */}
      <UserDialog open={dialogOpen} setOpen={setDialogOpen} />
    </>
  );
};

export default UserAvatar;
