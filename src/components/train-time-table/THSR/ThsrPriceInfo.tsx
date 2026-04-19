import { useTranslation } from "next-i18next";
import { FC, useMemo, useState } from "react";
import { JsyThsrFare, JsyThsrOdFare } from "../../../models/jsy-thsr-info";
import { getNameLangKey } from "../../../utils/LocaleUtils";

type LangKey = "zhTw" | "en";

export const ticketTypeMap = {
  1: "一般票",
  2: "來回票",
  3: "電子票證",
  4: "回數票",
  5: "定期票(30天)",
  6: "定期票(60天)",
  7: "早鳥票",
  8: "團體票",
};

export const fareClassMap: Record<number, Record<LangKey, string>> = {
  1: { zhTw: "成人", en: "Adult" },
  2: { zhTw: "學生", en: "" },
  3: { zhTw: "孩童", en: "" },
  4: { zhTw: "敬老", en: "" },
  5: { zhTw: "愛心", en: "" },
  6: { zhTw: "愛心孩童", en: "" },
  7: { zhTw: "愛心優待/愛心陪伴", en: "" },
  8: { zhTw: "軍警", en: "" },
  9: { zhTw: "法優", en: "Concession" },
};

export const cabinClassMap: Record<number, Record<LangKey, string>> = {
  1: { zhTw: "標準", en: "Regular" },
  2: { zhTw: "商務", en: "Business" },
  3: { zhTw: "自由", en: "Non-Reserved" },
};

export const fareMap = {
  ticketTypeMap,
  fareClassMap,
  cabinClassMap,
};

interface LabelPriceInfoProps {
  adultFares: JsyThsrFare[];
  otherFareList: JsyThsrFare[];
}

const LabelPriceInfo: FC<LabelPriceInfoProps> = ({
  adultFares,
  otherFareList,
}) => {
  const { t, i18n } = useTranslation();
  const langKey = getNameLangKey(i18n.language);
  const [isShowOtherFareList, setIsShowOtherFareList] = useState(false);

  return (
    <div className={`sticky top-0 flex flex-wrap gap-2`}>
      {adultFares.map((fare) => {
        return (
          <span
            className={`common-babel text-sm`}
            key={`${fare.ticketType}${fare.fareClass}${fare.cabinClass}`}
          >
            {fareMap.fareClassMap[fare.fareClass][langKey]}{" "}
            {fareMap.cabinClassMap[fare.cabinClass][langKey]} {fare.price}
          </span>
        );
      })}

      {isShowOtherFareList &&
        otherFareList.map((fare) => {
          return (
            <span
              className={`common-babel text-sm`}
              key={`${fare.ticketType}${fare.fareClass}${fare.cabinClass}`}
            >
              {fareMap.fareClassMap[fare.fareClass][langKey]}{" "}
              {fareMap.cabinClassMap[fare.cabinClass][langKey]} {fare.price}
            </span>
          );
        })}

      {
        <div
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsShowOtherFareList(!isShowOtherFareList);
            }
          }}
          className="common-babel-light custom-cursor-pointer text-sm"
          onClick={() => setIsShowOtherFareList(!isShowOtherFareList)}
        >
          {isShowOtherFareList ? "-" : "+"} {t("otherBtn")}
        </div>
      }
    </div>
  );
};

interface TextPriceInfoProps {
  fareList: JsyThsrFare[];
}

const TextPriceInfo: FC<TextPriceInfoProps> = ({ fareList }) => {
  const { t, i18n } = useTranslation();
  const langKey = getNameLangKey(i18n.language);
  const textFareList = fareList.map((fare) => {
    return (
      fareMap.fareClassMap[fare.fareClass][langKey] +
      " " +
      fareMap.cabinClassMap[fare.cabinClass][langKey] +
      " " +
      fare.price
    );
  });

  return textFareList.join(t("comma"));
};

interface ThsrPriceInfoProps {
  dataList: JsyThsrOdFare[];
  showLabel: boolean;
}

/** [高鐵] 票價資訊 */
const ThsrPriceInfo: FC<ThsrPriceInfoProps> = ({ dataList, showLabel }) => {
  const adultFares: JsyThsrFare[] = useMemo(
    () =>
      dataList[0].fares.filter(
        (fare) => fare.fareClass === 1 && fare.ticketType === 1,
      ),
    [dataList],
  );

  const otherFareList: JsyThsrFare[] = useMemo(
    () =>
      dataList[0].fares.filter(
        (fare) => fare.fareClass !== 1 && fare.ticketType === 1,
      ),
    [dataList],
  );

  return showLabel ? (
    <LabelPriceInfo adultFares={adultFares} otherFareList={otherFareList} />
  ) : (
    <TextPriceInfo fareList={[...adultFares, ...otherFareList]} />
  );
};

export default ThsrPriceInfo;
