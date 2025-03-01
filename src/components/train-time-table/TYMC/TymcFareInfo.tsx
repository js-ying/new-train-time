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
  ELDERLY = 4, // 敬老票
  CHARITY = 5, // 愛心票
  GROUP = 8, // 團體票
}

// 票價等級名稱對應（多語系）
const FARE_CLASS_MAP = {
  [FareClass.FULL]: { Zh_tw: "全票", En: "Full Fare" },
  [FareClass.STUDENT]: { Zh_tw: "學生票", En: "Student Fare" },
  [FareClass.CHILD]: { Zh_tw: "孩童票", En: "Child Fare" },
  [FareClass.ELDERLY]: { Zh_tw: "敬老票", En: "Senior Fare" },
  [FareClass.CHARITY]: { Zh_tw: "愛心票", En: "Charity Fare" },
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
