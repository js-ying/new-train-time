import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import usePage from "@/hooks/usePage";
import DateUtils from "@/utils/DateUtils";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/zh-tw";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useTranslation } from "next-i18next";
import { FC, useContext } from "react";

// AdapterDayjs 內部會用到 utc/timezone plugin
dayjs.extend(utc);
dayjs.extend(timezone);

const DatePicker: FC = () => {
  const { i18n } = useTranslation();
  const adapterLocale = i18n.language === "en" ? "en" : "zh-tw";

  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const { page } = usePage();

  const selectedDate = dayjs(params.date);

  const setDate = (date: Dayjs | null) => {
    if (!date) return;

    setParams({
      ...params,
      date: date.format("YYYY-MM-DD"),
    });
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={adapterLocale}
    >
      <DateCalendar
        value={selectedDate}
        onChange={(datetime) => setDate(datetime)}
        views={["day"]}
        disablePast={true}
        maxDate={dayjs().add(DateUtils.getMaxDays(page), "day")}
        reduceAnimations={true}
        timezone={"Asia/Taipei"}
        dayOfWeekFormatter={(_day, weekday) => `${_day}`}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
