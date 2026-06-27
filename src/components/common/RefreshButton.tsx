import { useTranslation } from "next-i18next";
import { FC, useState } from "react";

/** 重新整理（arrow-path）icon；spin 時套用 .rotate（比照 ThemeSwitch 的旋轉動畫）。 */
const RefreshIcon: FC<{ spin?: boolean }> = ({ spin }) => (
  <svg
    viewBox="0 0 24 24"
    className={`size-4 ${spin ? "rotate" : ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);

interface RefreshButtonProps {
  /** 按下時呼叫；冷卻攔截與提示由呼叫端處理 */
  onRefresh: () => void;
}

/** 共用「重新整理」：純 icon（無按鈕底色 / hover），點擊旋轉，比照 ThemeSwitch。 */
const RefreshButton: FC<RefreshButtonProps> = ({ onRefresh }) => {
  const { t } = useTranslation();
  // 每次按下 +1，藉 key 變更 remount icon 以重播 .rotate（>0 才轉，避免初次出現就轉）
  const [spinCount, setSpinCount] = useState(0);

  const handlePress = () => {
    setSpinCount((c) => c + 1);
    onRefresh();
  };

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={t("refreshBtnLabel")}
      className="custom-cursor-pointer inline-flex p-1 text-zinc-600 dark:text-zinc-300"
      onClick={handlePress}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handlePress();
      }}
    >
      <RefreshIcon key={spinCount} spin={spinCount > 0} />
    </div>
  );
};

export default RefreshButton;
