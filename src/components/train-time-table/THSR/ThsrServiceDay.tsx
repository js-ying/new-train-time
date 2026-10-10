import { useTranslation } from "next-i18next";
import { FC } from "react";
import { JsyThsrServiceDay } from "../../../models/jsy-thsr-info";
import type { TFunction } from "i18next";

/** [高鐵] 行駛日文字：全週行駛顯示每日行駛，否則列出行駛的星期 */
const getServiceDaysMsg = (
  t: TFunction,
  data: JsyThsrServiceDay | null,
): string => {
  if (!data) return "";

  const serviceDays = (Object.entries(data) as [keyof typeof data, number][])
    .filter(([, value]) => value === 1)
    .map(([day]) => t(`thsrServiceWeekday.${day}`));

  return serviceDays.length === 7
    ? t("thsrServiceDaily")
    : t("thsrServiceDays", { days: serviceDays.join(t("comma")) });
};

interface ThsrServiceDayProps {
  serviceDay: JsyThsrServiceDay | null;
}

const ThsrServiceDay: FC<ThsrServiceDayProps> = ({ serviceDay }) => {
  const { t } = useTranslation();
  return <div>{getServiceDaysMsg(t, serviceDay)}</div>;
};

export default ThsrServiceDay;
