import { JsyTymcInfo } from "@/models/jsy-tymc-info";
import { getTdxLang } from "@/utils/LocaleUtils";
import { useTranslation } from "next-i18next";

// 票種 Enum
enum TicketType {
  SINGLE = 1, // 單程票
  ELECTRONIC = 3, // 電子票證
}

// 票價等級 Enum
enum FareClass {
  FULL = 1, // 全票
  STUDENT = 2, // 學生票
  CHILD = 3, // 孩童票
  SENIOR = 4, // 敬老票
  DISABLED = 5, // 愛心票
  DISABLED_CHILD = 6, // 愛心票
  DISABLED_SPECIAL = 7, // 愛心票
  GROUP = 8, // 團體票
}

// 票價等級名稱對應（多語系）
const FARE_CLASS_MAP = {
  [FareClass.FULL]: { Zh_tw: "全票", En: "Full Fare" },
  [FareClass.STUDENT]: { Zh_tw: "學生票", En: "Student Fare" },
  [FareClass.CHILD]: { Zh_tw: "孩童票", En: "Child Fare" },
  [FareClass.SENIOR]: { Zh_tw: "敬老票", En: "Senior Fare" },
  [FareClass.DISABLED]: { Zh_tw: "愛心票", En: "Disabled Fare" },
  [FareClass.DISABLED_CHILD]: {
    Zh_tw: "愛心孩童票",
    En: "Disabled Child Fare",
  },
  [FareClass.DISABLED_SPECIAL]: {
    Zh_tw: "愛心優待/陪伴票",
    En: "Disabled Special Fare",
  },
  [FareClass.GROUP]: { Zh_tw: "團體票", En: "Group Fare" },
};

interface TymcFareInfoProps {
  fares: JsyTymcInfo["fareList"];
}

const TymcFareInfo: React.FC<TymcFareInfoProps> = ({ fares }) => {
  const { t, i18n } = useTranslation();

  // 過濾只要單程票，且排除團體票的資料
  const filteredFares = fares.filter(
    (fare) =>
      fare.TicketType === TicketType.SINGLE &&
      fare.FareClass !== FareClass.GROUP,
  );

  // 轉換成文字陣列
  const fareTexts = filteredFares.map(
    (fare) =>
      `${FARE_CLASS_MAP[fare.FareClass][getTdxLang(i18n.language)]} ${fare.Price}`,
  );

  // 用逗號連接
  return fareTexts.join(t("comma"));
};

export default TymcFareInfo;
