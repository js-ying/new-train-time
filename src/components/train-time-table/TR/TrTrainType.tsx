import useLang from "@/hooks/useLang";
import { FC } from "react";

interface TrTrainTypeProps {
  code: string;
  trainTypeName: string;
}

/** TR 車種顏色 — 列舉色為業務語意，直接用 Tailwind palette；
 * 暗模式以 80% 透明降飽和（視覺微調，與既有設計一致）。
 * Tailwind JIT 只能掃靜態 class，因此完整字串得列在這裡。 */
type TrTrainTypeStyle = { tw: string; en: string };
const TR_TRAIN_TYPE_STYLE: Record<string, TrTrainTypeStyle> = {
  // 自強 / 太魯閣自強
  "3": {
    tw: "bg-teal-500 text-white dark:bg-teal-500/80",
    en: "font-bold text-teal-500 dark:text-teal-500/80",
  },
  "11": {
    tw: "bg-teal-500 text-white dark:bg-teal-500/80",
    en: "font-bold text-teal-500 dark:text-teal-500/80",
  },
  // 區間 / 區間快
  "6": {
    tw: "bg-sky-500 text-white dark:bg-sky-500/80",
    en: "font-bold text-sky-500 dark:text-sky-500/80",
  },
  "7": {
    tw: "bg-sky-500 text-white dark:bg-sky-500/80",
    en: "font-bold text-sky-500 dark:text-sky-500/80",
  },
  "10": {
    tw: "bg-sky-500 text-white dark:bg-sky-500/80",
    en: "font-bold text-sky-500 dark:text-sky-500/80",
  },
  // 太魯閣號（舊）
  "1": {
    tw: "bg-indigo-500 text-white dark:bg-indigo-500/80",
    en: "font-bold text-indigo-500 dark:text-indigo-500/80",
  },
  // 普悠瑪
  "2": {
    tw: "bg-rose-500 text-white dark:bg-rose-500/80",
    en: "font-bold text-rose-500 dark:text-rose-500/80",
  },
  // 莒光
  "4": {
    tw: "bg-amber-500 text-white dark:bg-amber-500/80",
    en: "font-bold text-amber-500 dark:text-amber-500/80",
  },
  // 復興
  "5": {
    tw: "bg-amber-500 text-white dark:bg-amber-500/80",
    en: "font-bold text-amber-500 dark:text-amber-500/80",
  },
};

const TrTrainType: FC<TrTrainTypeProps> = ({ code, trainTypeName }) => {
  const { isTw } = useLang();
  const style = TR_TRAIN_TYPE_STYLE[code];
  if (!style) return null;

  return (
    <span className={`rounded px-1 py-0.5 ${isTw ? style.tw : style.en}`}>
      {trainTypeName}
    </span>
  );
};

export default TrTrainType;
