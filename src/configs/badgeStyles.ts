/**
 * 實心列舉色 badge 共用樣式：亮色實色白字、暗色以 80% 透明降飽和。
 * 車種、更新分類等「不隨主題切換變色」的列舉 badge 共用；
 * Tailwind JIT 只掃靜態 class，故完整字串集中列於此處。
 */
export const SOLID_BADGE = {
  teal: "bg-teal-500 text-white dark:bg-teal-500/80",
  sky: "bg-sky-500 text-white dark:bg-sky-500/80",
  indigo: "bg-indigo-500 text-white dark:bg-indigo-500/80",
  rose: "bg-rose-500 text-white dark:bg-rose-500/80",
  amber: "bg-amber-500 text-white dark:bg-amber-500/80",
} as const;
