import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment-timezone";
import "moment/locale/zh-tw";
import { useTranslation } from "next-i18next";
import { useContext, useMemo } from "react";
import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "../../contexts/SearchAreaContext";
import DateUtils from "../../utils/date-utils";

const NowTimeButton = () => {
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const resetDateTime = () => {
    setParams({
      ...params,
      date: DateUtils.getCurrentDate(),
      time: DateUtils.getCurrentTime(),
    });
  };

  return (
    <div
      className="dark:text-orange cursor-pointer text-grayBlue"
      onClick={resetDateTime}
    >
      此時此刻
    </div>
  );
};

const TimePicker = () => {
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  // 為了讓 <此時此刻> 按鈕方便運作，這邊不使用 useState，而是每次 re-render 時直接取得 params 最新值即可
  const hour = params.time?.split(":")[0];
  const min = params.time?.split(":")[1];

  const setTime = (type: string, value: string) => {
    if (type === "hour") {
      setParams({
        ...params,
        time: `${value}:${min}`,
      });
    } else {
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
    <div className="relative flex items-center">
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
      <div className="absolute -right-16 text-sm">
        <NowTimeButton />
      </div>
    </div>
  );
};

const DatePicker = () => {
  const { i18n } = useTranslation();
  moment.locale(i18n.language === "en" ? "en" : "zh-tw");

  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  // 為了讓 <此時此刻> 按鈕方便運作，這邊不使用 useState，而是每次 re-render 時直接取得 params 最新值即可
  const selectedDate = moment(params.date);

  const setDate = (date) => {
    if (!date) return;

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
