import { SOLID_BADGE } from "@/configs/badgeStyles";
import useLang from "@/hooks/useLang";
import { FC } from "react";

interface TrTrainTypeProps {
  code: string;
  trainTypeName: string;
  /** 額外樣式（呼叫端控制寬度/排版，預設不影響既有用法） */
  className?: string;
}

/** TR 車種顏色 — 列舉色為業務語意，直接用 Tailwind palette；
 * 中文實心 badge 共用 SOLID_BADGE，英文文字版（-500 暗色 /80 降飽和）僅此處使用。 */
type TrTrainTypeStyle = { tw: string; en: string };
const TR_TRAIN_TYPE_STYLE: Record<string, TrTrainTypeStyle> = {
  // 自強 / 太魯閣自強
  "3": { tw: SOLID_BADGE.teal, en: "font-bold text-teal-500 dark:text-teal-500/80" },
  "11": { tw: SOLID_BADGE.teal, en: "font-bold text-teal-500 dark:text-teal-500/80" },
  // 區間 / 區間快
  "6": { tw: SOLID_BADGE.sky, en: "font-bold text-sky-500 dark:text-sky-500/80" },
  "7": { tw: SOLID_BADGE.sky, en: "font-bold text-sky-500 dark:text-sky-500/80" },
  "10": { tw: SOLID_BADGE.sky, en: "font-bold text-sky-500 dark:text-sky-500/80" },
  // 太魯閣號（舊）
  "1": { tw: SOLID_BADGE.indigo, en: "font-bold text-indigo-500 dark:text-indigo-500/80" },
  // 普悠瑪
  "2": { tw: SOLID_BADGE.rose, en: "font-bold text-rose-500 dark:text-rose-500/80" },
  // 莒光
  "4": { tw: SOLID_BADGE.amber, en: "font-bold text-amber-500 dark:text-amber-500/80" },
  // 復興
  "5": { tw: SOLID_BADGE.amber, en: "font-bold text-amber-500 dark:text-amber-500/80" },
};

const TrTrainType: FC<TrTrainTypeProps> = ({
  code,
  trainTypeName,
  className = "",
}) => {
  const { isTw } = useLang();
  const style = TR_TRAIN_TYPE_STYLE[code];
  if (!style) return null;

  return (
    <span
      className={`rounded px-1 py-0.5 ${isTw ? style.tw : style.en} ${className}`}
    >
      {trainTypeName}
    </span>
  );
};

export default TrTrainType;
