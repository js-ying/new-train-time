import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment-timezone";
import "moment/locale/zh-tw";
import { useTranslation } from "next-i18next";
import { useContext, useMemo, useState } from "react";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "../contexts/SearchAreaContext";

const TimePicker = () => {
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const [hour, setHour] = useState(params.time?.split(":")[0]);
  const [min, setMin] = useState(params.time?.split(":")[1]);

  const setTime = (type: string, value: string) => {
    if (type === "hour") {
      setHour(value);
      setParams({
        ...params,
        time: `${value}:${min}`,
      });
    } else {
      setMin(value);
      setParams({
        ...params,
        time: `${hour}:${value}`,
      });
    }
  };

  const generateOptions = (start: number, end: number) => {
    const options = [];
    for (let i = start; i <= end; i++) {
      options.push(i.toString().padStart(2, "0"));
    }
    return options;
  };

  const hourOptions = useMemo(() => generateOptions(0, 23), []);
  const minOptions = useMemo(() => generateOptions(0, 59), []);

  return (
    <>
      <select
        value={hour}
        onChange={(e) => setTime("hour", e.target.value)}
        className="common-select"
      >
        {hourOptions.map((hour) => (
          <option value={hour} key={hour}>
            {hour}
          </option>
        ))}
      </select>
      <span className="mx-1">:</span>
      <select
        value={min}
        onChange={(e) => setTime("min", e.target.value)}
        className="common-select"
      >
        {minOptions.map((min) => (
          <option value={min} key={min}>
            {min}
          </option>
        ))}
      </select>
    </>
  );
};

const DatePicker = () => {
  const { i18n } = useTranslation();
  moment.locale(i18n.language === "en" ? "en" : "zh-tw");

  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const [selectedDate, setSelectedDate] = useState(moment(params.date));

  const setDate = (date) => {
    if (!date) return;

    setSelectedDate(date);

    setParams({
      ...params,
      date: date.format("YYYY-MM-DD"),
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} dateLibInstance={moment}>
      <DateCalendar
        value={selectedDate}
        onChange={(datetime) => setDate(datetime)}
        views={["day"]}
        disablePast={true}
        maxDate={moment().add(2, "months")}
        reduceAnimations={true}
        timezone={"Asia/Taipei"}
        dayOfWeekFormatter={(_day, weekday) => `${_day}`}
      />
    </LocalizationProvider>
  );
};

/** 日期選擇器 */
const SelectDatetime = () => {
  return (
    <div className="flex select-none flex-col">
      <div className="rounded-md border border-zinc-300">
        <DatePicker />
      </div>
      <div className="mt-2 flex justify-center">
        <TimePicker />
      </div>
    </div>
  );
};

export default SelectDatetime;
