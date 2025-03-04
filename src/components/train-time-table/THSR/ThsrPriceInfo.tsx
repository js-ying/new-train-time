import { useTranslation } from "next-i18next";
import { FC, useMemo, useState } from "react";
import { ThsrFare, ThsrOdFare } from "../../../models/jsy-thsr-info";
import { getTdxLang } from "../../../utils/LocaleUtils";

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

export const fareClassMap = {
  1: { Zh_tw: "成人", En: "Adult" },
  2: { Zh_tw: "學生", En: "" },
  3: { Zh_tw: "孩童", En: "" },
  4: { Zh_tw: "敬老", En: "" },
  5: { Zh_tw: "愛心", En: "" },
  6: { Zh_tw: "愛心孩童", En: "" },
  7: { Zh_tw: "愛心優待/愛心陪伴", En: "" },
  8: { Zh_tw: "軍警", En: "" },
  9: { Zh_tw: "法優", En: "Concession" },
};

export const cabinClassMap = {
  1: { Zh_tw: "標準", En: "Regular" },
  2: { Zh_tw: "商務", En: "Business" },
  3: { Zh_tw: "自由", En: "Non-Reserved" },
};

export const fareMap = {
  ticketTypeMap,
  fareClassMap,
  cabinClassMap,
};

interface LabelPriceInfoProps {
  adultFares: ThsrFare[];
  otherFareList: ThsrFare[];
}

const LabelPriceInfo: FC<LabelPriceInfoProps> = ({
  adultFares,
  otherFareList,
}) => {
  const { t, i18n } = useTranslation();
  const [isShowOtherFareList, setIsShowOtherFareList] = useState(false);

  return (
    <div className={`sticky top-0 flex flex-wrap gap-2`}>
      {adultFares.map((fare) => {
        return (
          <span
            className={`common-babel text-sm`}
            key={`${fare.TicketType}${fare.FareClass}${fare.CabinClass}`}
          >
            {fareMap.fareClassMap[fare.FareClass][getTdxLang(i18n.language)]}{" "}
            {fareMap.cabinClassMap[fare.CabinClass][getTdxLang(i18n.language)]}{" "}
            {fare.Price}
          </span>
        );
      })}

      {isShowOtherFareList &&
        otherFareList.map((fare, index) => {
          return (
            <span
              className={`common-babel text-sm`}
              key={`${fare.TicketType}${fare.FareClass}${fare.CabinClass}`}
            >
              {fareMap.fareClassMap[fare.FareClass][getTdxLang(i18n.language)]}{" "}
              {
                fareMap.cabinClassMap[fare.CabinClass][
                  getTdxLang(i18n.language)
                ]
              }{" "}
              {fare.Price}
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
  fareList: ThsrFare[];
}

const TextPriceInfo: FC<TextPriceInfoProps> = ({ fareList }) => {
  const { t, i18n } = useTranslation();
  const textFareList = fareList.map((fare) => {
    return (
      fareMap.fareClassMap[fare.FareClass][getTdxLang(i18n.language)] +
      " " +
      fareMap.cabinClassMap[fare.CabinClass][getTdxLang(i18n.language)] +
      " " +
      fare.Price
    );
  });

  return textFareList.join(t("comma"));
};

interface ThsrPriceInfoProps {
  dataList: ThsrOdFare[];
  showLabel: boolean;
}

/** [高鐵] 票價資訊 */
const ThsrPriceInfo: FC<ThsrPriceInfoProps> = ({ dataList, showLabel }) => {
  let adultFares: ThsrFare[] = useMemo(
    () =>
      dataList[0].Fares.filter(
        (fare) => fare.FareClass === 1 && fare.TicketType === 1,
      ),
    [dataList],
  );

  let otherFareList: ThsrFare[] = useMemo(
    () =>
      dataList[0].Fares.filter(
        (fare) => fare.FareClass !== 1 && fare.TicketType === 1,
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
