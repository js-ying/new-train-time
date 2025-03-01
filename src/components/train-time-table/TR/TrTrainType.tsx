import useLang from "@/hooks/useLangHook";
import { FC } from "react";

interface TrTrainTypeProps {
  code: string;
  trainTypeName: string;
}

const TrTrainType: FC<TrTrainTypeProps> = ({ code, trainTypeName }) => {
  const { isTw } = useLang();

  return (
    <>
      {/* 自強 */}
      {["3", "11"].includes(code) && (
        <span
          className={`rounded px-1 py-0.5
            ${
              isTw
                ? "bg-teal-500 text-white dark:bg-teal-500/80"
                : "font-bold text-teal-500 dark:text-teal-500/80"
            }`}
        >
          {trainTypeName}
        </span>
      )}

      {/* 區間 */}
      {["6", "7", "10"].includes(code) && (
        <span
          className={`rounded px-1 py-0.5
            ${
              isTw
                ? "bg-sky-500 text-white dark:bg-sky-500/80"
                : "font-bold text-sky-500 dark:text-sky-500/80"
            }`}
        >
          {trainTypeName}
        </span>
      )}

      {/* 大魯閣 */}
      {["1"].includes(code) && (
        <span
          className={`rounded px-1 py-0.5 
            ${
              isTw
                ? "bg-indigo-500 text-white dark:bg-indigo-500/80"
                : "font-bold text-indigo-500 dark:text-indigo-500/80"
            }`}
        >
          {trainTypeName}
        </span>
      )}

      {/* 普悠瑪 */}
      {["2"].includes(code) && (
        <span
          className={`rounded px-1 py-0.5 
            ${
              isTw
                ? "bg-rose-500 text-white dark:bg-rose-500/80"
                : "font-bold text-rose-500 dark:text-rose-500/80"
            }`}
        >
          {trainTypeName}
        </span>
      )}

      {/* 莒光號 */}
      {["4"].includes(code) && (
        <span
          className={`rounded px-1 py-0.5
            ${
              isTw
                ? "bg-amber-500 text-white dark:bg-amber-500/80"
                : "font-bold text-amber-500 dark:text-amber-500/80"
            }`}
        >
          {trainTypeName}
        </span>
      )}

      {/* 復興 */}
      {["5"].includes(code) && (
        <span
          className={`rounded px-1 py-0.5
            ${
              isTw
                ? "bg-amber-500 text-white dark:bg-amber-500/80"
                : "font-bold text-amber-500 dark:text-amber-500/80"
            }`}
        >
          {trainTypeName}
        </span>
      )}
    </>
  );
};

export default TrTrainType;
