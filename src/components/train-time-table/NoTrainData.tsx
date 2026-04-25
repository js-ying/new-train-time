import DataState from "@/components/common/DataState";
import { ApiError } from "@/models/problem-details";
import { FC } from "react";

interface NoTrainDataProps {
  /** 來自 useTrainSearch 的 API 錯誤；非 null 即顯示紅 Alert（含重試按鈕） */
  apiError: ApiError | null;
  /** API 健康但時段無資料時觸發 Empty 狀態 */
  onRetry?: () => void;
}

/**
 * 搜尋結果無資料時的占位元件，現在僅是 DataState 的 thin wrapper：
 * - apiError 為 null：顯示「時段太晚 / 兩站無班次」黃色 Alert
 * - apiError 非 null：顯示紅色 Alert + 對應 i18n 錯誤訊息（retryable 帶重試按鈕）
 */
const NoTrainData: FC<NoTrainDataProps> = ({ apiError, onRetry }) => {
  return <DataState isEmpty={apiError === null} error={apiError} onRetry={onRetry} />;
};

export default NoTrainData;
