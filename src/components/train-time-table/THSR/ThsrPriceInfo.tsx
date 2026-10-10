import { useTranslation } from "next-i18next";
import { FC, useMemo, useState } from "react";
import { JsyThsrFare, JsyThsrOdFare } from "../../../models/jsy-thsr-info";
import type { TFunction } from "i18next";

/** [高鐵] 票價標籤：票種 + 車廂（文字定義於 common.json `thsrFareClass` / `thsrCabinClass`） */
const getFareLabel = (t: TFunction, fare: JsyThsrFare): string =>
  `${t(`thsrFareClass.${fare.fareClass}`)} ${t(`thsrCabinClass.${fare.cabinClass}`)}`;

interface LabelPriceInfoProps {
  adultFares: JsyThsrFare[];
  otherFareList: JsyThsrFare[];
}

const LabelPriceInfo: FC<LabelPriceInfoProps> = ({
  adultFares,
  otherFareList,
}) => {
  const { t } = useTranslation();
  const [isShowOtherFareList, setIsShowOtherFareList] = useState(false);

  return (
    <div className="flex flex-wrap gap-2">
      {adultFares.map((fare) => {
        return (
          <span
            className={`common-babel text-sm`}
            key={`${fare.ticketType}${fare.fareClass}${fare.cabinClass}`}
          >
            {getFareLabel(t, fare)} {fare.price}
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
              {getFareLabel(t, fare)} {fare.price}
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
  const { t } = useTranslation();
  const textFareList = fareList.map(
    (fare) => `${getFareLabel(t, fare)} ${fare.price}`,
  );

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
