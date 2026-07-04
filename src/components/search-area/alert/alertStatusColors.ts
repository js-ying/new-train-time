/** 營運通阻狀態 → 顏色與 i18n 對照（三鐵 OperationAlert 與公車 BusOperationAlert 共用） */
export const ALERT_STATUS_COLORS = new Map<
  string,
  { text: string; bg: string; border: string; i18n: string }
>([
  [
    "normal",
    {
      text: "",
      bg: "bg-emerald-600 dark:bg-emerald-400",
      border: "border-emerald-600 dark:border-emerald-400",
      i18n: "normalOpStatus",
    },
  ],
  [
    "warning",
    {
      text: "text-orange-500 dark:text-orange-400",
      bg: "bg-orange-500 dark:bg-orange-400",
      border: "border-orange-500 dark:border-orange-400",
      i18n: "warningOpStatus",
    },
  ],
  [
    "danger",
    {
      text: "text-red-600 dark:text-red-400",
      bg: "bg-red-600 dark:bg-red-400",
      border: "border-red-600 dark:border-red-400",
      i18n: "dangerOpStatus",
    },
  ],
]);
