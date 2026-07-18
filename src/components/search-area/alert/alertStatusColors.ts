/** 營運通阻狀態 → 顏色與 i18n 對照（三鐵 OperationAlert 與公車 BusOperationAlert 共用） */
export const ALERT_STATUS_COLORS = new Map<
  string,
  { text: string; bg: string; border: string; i18n: string }
>([
  [
    "normal",
    {
      text: "",
      bg: "bg-success",
      border: "border-success",
      i18n: "normalOpStatus",
    },
  ],
  [
    "warning",
    {
      text: "text-warning",
      bg: "bg-warning",
      border: "border-warning",
      i18n: "warningOpStatus",
    },
  ],
  [
    "danger",
    {
      text: "text-danger",
      bg: "bg-danger",
      border: "border-danger",
      i18n: "dangerOpStatus",
    },
  ],
]);
