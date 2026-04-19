import { JsyTymcInfo } from "@/models/jsy-tymc-info";
import { getNameLangKey } from "@/utils/LocaleUtils";
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

type LangKey = "zhTw" | "en";

// 票價等級名稱對應（多語系）
const FARE_CLASS_MAP: Record<number, Record<LangKey, string>> = {
  [FareClass.FULL]: { zhTw: "全票", en: "Full Fare" },
  [FareClass.STUDENT]: { zhTw: "學生票", en: "Student Fare" },
  [FareClass.CHILD]: { zhTw: "孩童票", en: "Child Fare" },
  [FareClass.SENIOR]: { zhTw: "敬老票", en: "Senior Fare" },
  [FareClass.DISABLED]: { zhTw: "愛心票", en: "Disabled Fare" },
  [FareClass.DISABLED_CHILD]: {
    zhTw: "愛心孩童票",
    en: "Disabled Child Fare",
  },
  [FareClass.DISABLED_SPECIAL]: {
    zhTw: "愛心優待/陪伴票",
    en: "Disabled Special Fare",
  },
  [FareClass.GROUP]: { zhTw: "團體票", en: "Group Fare" },
};

interface TymcFareInfoProps {
  fares: JsyTymcInfo["fareList"];
}

const TymcFareInfo: React.FC<TymcFareInfoProps> = ({ fares }) => {
  const { t, i18n } = useTranslation();
  const langKey = getNameLangKey(i18n.language);

  // 過濾只要單程票，且排除團體票的資料
  const filteredFares = fares.filter(
    (fare) =>
      fare.ticketType === TicketType.SINGLE &&
      fare.fareClass !== FareClass.GROUP,
  );

  // 轉換成文字陣列
  const fareTexts = filteredFares.map(
    (fare) => `${FARE_CLASS_MAP[fare.fareClass][langKey]} ${fare.price}`,
  );

  return fareTexts.join(t("comma"));
};

export default TymcFareInfo;
