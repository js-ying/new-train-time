import { JsyTymcInfo } from "@/models/jsy-tymc-info";
import { useTranslation } from "next-i18next";

// 票種 Enum
enum TicketType {
  SINGLE = 1, // 單程票
  ELECTRONIC = 3, // 電子票證
}

// 票價等級 Enum
enum FareClass {
  FULL = 1,
  STUDENT = 2,
  CHILD = 3,
  SENIOR = 4,
  DISABLED = 5,
  DISABLED_CHILD = 6,
  DISABLED_SPECIAL = 7,
  GROUP = 8,
}

interface TymcFareInfoProps {
  fares: JsyTymcInfo["fareList"];
}

const TymcFareInfo: React.FC<TymcFareInfoProps> = ({ fares }) => {
  const { t } = useTranslation();

  // 過濾只要單程票，且排除團體票的資料
  const filteredFares = fares.filter(
    (fare) =>
      fare.ticketType === TicketType.SINGLE &&
      fare.fareClass !== FareClass.GROUP,
  );

  // 轉換成文字陣列（票種文字定義於 common.json `tymcFareClass`）
  const fareTexts = filteredFares.map(
    (fare) =>
      `${t(`tymcFareClass.${fare.fareClass}`)} ${t("fareAmount", { price: fare.price })}`,
  );

  return fareTexts.join(t("comma"));
};

export default TymcFareInfo;
