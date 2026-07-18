import Link, { LinkProps } from "next/link";
import { FC, MouseEvent, ReactNode } from "react";

/** 單顆快查藥丸資料；onClick 用於 GA/歷史，不應 preventDefault 以保留 <a href> 可爬性 */
export interface QuickPickItem {
  key: string;
  label: ReactNode;
  href: LinkProps["href"];
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  /** a[title]（SEO / hover 提示） */
  title?: string;
}

interface QuickPickPillsProps {
  /** 區塊標題（如「熱門路線快速查詢」「熱門車站快速查詢」） */
  title: string;
  items: QuickPickItem[];
  /** true=手機一排固定 3 顆（grid）、桌機自然換行；預設 false=一律 flex-wrap（OD 用） */
  mobileGrid3?: boolean;
}

/**
 * 熱門快查藥丸列（純呈現）。熱門路線 / 熱門車站 / 未來熱門公車路線共用同一顆藥丸樣式，
 * 各模式只需組好 items（label / href / onClick）丟進來，SSR 即渲染為可爬的內部連結。
 */
const QuickPickPills: FC<QuickPickPillsProps> = ({
  title,
  items,
  mobileGrid3 = false,
}) => {
  if (!items.length) return null;
  // 短 label（單站站名）用 grid 強制手機每排 3 顆；OD 長 label 維持自然換行
  const listClass = mobileGrid3
    ? "grid grid-cols-3 justify-items-center gap-2 sm:flex sm:flex-wrap sm:justify-center"
    : "flex flex-wrap justify-center gap-2";
  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 text-sm text-muted-foreground">
        {title}
      </div>
      <div className={listClass}>
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            onClick={item.onClick}
            title={item.title}
            className="rounded-full border border-zinc-400 px-4 py-1.5 text-xs text-zinc-600 transition-all hover:border-silverLakeBlue-500 hover:text-silverLakeBlue-500 dark:border-zinc-500 dark:text-zinc-300 dark:hover:border-gamboge-500 dark:hover:text-gamboge-500"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickPickPills;
