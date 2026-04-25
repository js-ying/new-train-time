import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** 合併 className：clsx 處理條件式輸入，twMerge 解決 Tailwind class 衝突 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
