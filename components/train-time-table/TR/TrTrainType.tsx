import { FC } from "react";
import useLang from "../../../hooks/useLangHook";

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
          className={`rounded px-1 py-0.5 text-white 
            ${
              isTw
                ? "bg-teal-500 dark:bg-teal-500/80"
                : "font-bold text-teal-500 dark:text-teal-500/80"
            }`}
        >
          {trainTypeName}
        </span>
      )}

      {/* 區間 */}
      {["6", "7", "10"].includes(code) && (
        <span
          className={`rounded px-1 py-0.5 text-white 
            ${
              isTw
                ? "bg-sky-500 dark:bg-sky-500/80"
                : "font-bold text-sky-500 dark:text-sky-500/80"
            }`}
        >
          {trainTypeName}
        </span>
      )}

      {/* 大魯閣 */}
      {["1"].includes(code) && (
        <span
          className={`rounded px-1 py-0.5 text-white 
            ${
              isTw
                ? "bg-indigo-500 dark:bg-indigo-500/80"
                : "font-bold text-indigo-500 dark:text-indigo-500/80"
            }`}
        >
          {trainTypeName}
        </span>
      )}

      {/* 普悠瑪 */}
      {["2"].includes(code) && (
        <span
          className={`rounded px-1 py-0.5 text-white 
            ${
              isTw
                ? "bg-rose-500 dark:bg-rose-500/80"
                : "font-bold text-rose-500 dark:text-rose-500/80"
            }`}
        >
          {trainTypeName}
        </span>
      )}

      {/* 莒光號 */}
      {["4"].includes(code) && (
        <span
          className={`rounded px-1 py-0.5 text-white 
            ${
              isTw
                ? "bg-amber-500 dark:bg-amber-500/80"
                : "font-bold text-amber-500 dark:text-amber-500/80"
            }`}
        >
          {trainTypeName}
        </span>
      )}

      {/* 復興 */}
      {["5"].includes(code) && (
        <span
          className={`rounded px-1 py-0.5 text-white 
            ${
              isTw
                ? "bg-amber-500 dark:bg-amber-500/80"
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
