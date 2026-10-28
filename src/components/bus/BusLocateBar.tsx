import BusEmptyNotice from "@/components/bus/BusEmptyNotice";
import BusOperationAlert from "@/components/bus/BusOperationAlert";
import CommonAlert from "@/components/common/CommonAlert";
import LocateIcon from "@/components/icons/LocateIcon";
import { JsyBusAlert } from "@/models/jsy-bus-info";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, ReactNode } from "react";

interface BusLocateBarProps {
  onLocate: () => void;
  /** 定位失敗訊息 */
  geoError: string | null;
  /** 附近查無站牌 */
  notFound: boolean;
  /** 路線營運通阻公告（掛最左；無公告時不佔位） */
  alerts?: JsyBusAlert[];
  /** 收藏愛心（掛最右） */
  favoriteSlot?: ReactNode;
}

/** [公車] 「離我最近站牌」列：左通阻公告、中定位鈕、右收藏，下方接定位錯誤 / 查無站牌提示。 */
const BusLocateBar: FC<BusLocateBarProps> = ({
  onLocate,
  geoError,
  notFound,
  alerts,
  favoriteSlot,
}) => {
  const { t } = useTranslation();

  return (
    // 限寬同看板與站牌卡片
    <div className="mx-auto mt-4 flex w-full flex-col items-center gap-1 md:max-w-md">
      <div className="relative flex w-full justify-center">
        <div className="absolute inset-y-0 left-3 flex items-center">
          <BusOperationAlert alerts={alerts} />
        </div>
        <Button
          isIconOnly
          variant="light"
          aria-label={t("busNearestStop")}
          onPress={onLocate}
        >
          <LocateIcon className="h-4 w-4" />
        </Button>
        {favoriteSlot && (
          <div className="absolute inset-y-0 right-0 flex items-center">
            {favoriteSlot}
          </div>
        )}
      </div>
      {/* 定位失敗：比照 API 錯誤的 error Alert，位置同附近查無站牌 */}
      {geoError && (
        <CommonAlert severity="error" className="mt-3 w-full">
          <div className="font-bold">{geoError}</div>
        </CommonAlert>
      )}
      {/* 附近查無站牌：同無資料提示，距上方按鈕列同無即時（gap-1 + mt-3 = 16px） */}
      {notFound && (
        <BusEmptyNotice className="mt-3 w-full">
          {t("busNearestNotFound")}
        </BusEmptyNotice>
      )}
    </div>
  );
};

export default BusLocateBar;
