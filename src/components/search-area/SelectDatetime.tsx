import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import usePage from "@/hooks/usePageHook";
import DateUtils from "@/utils/DateUtils";
import { Button } from "@heroui/react";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment-timezone";
import "moment/locale/zh-tw";
import { useTranslation } from "next-i18next";
import { FC, useContext, useMemo } from "react";

const NowTimeButton: FC = () => {
  const { t } = useTranslation();
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
    <Button
      className="text-md min-w-fit text-silverLakeBlue-500 dark:text-gamboge-500"
      variant="light"
      size="sm"
      onPress={resetDateTime}
    >
      {t("nowTimeBtn")}
    </Button>
  );
};

const TimeSelect: FC<{
  value: string;
  options: { key: string; label: string }[];
  onSelect: (val: string) => void;
  ariaLabel: string;
}> = ({ value, options, onSelect, ariaLabel }) => {
  return (
    <select
      className="common-select"
      value={value}
      onChange={(item) => onSelect(item.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.key} value={opt.label}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

const TimePicker: FC = () => {
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);
  const generateOptions = (
    start: number,
    end: number,
    step: number = 1,
  ): { key: string; label: string }[] => {
    const options = [];
    for (let i = start; i <= end; i += step) {
      options.push({
        key: i.toString().padStart(2, "0"),
        label: i.toString().padStart(2, "0"),
      });
    }
    return options;
  };

  const hourOptions = useMemo(() => generateOptions(0, 23), []);
  const minOptions = useMemo(() => generateOptions(0, 59), []);

  // 為了讓 <AM/PM> 和 <此刻> 按鈕方便運作，這邊不使用 useState，而是每次 re-render 時直接取得 params 最新值即可
  const hour = params.time?.split(":")[0];
  const min = params.time?.split(":")[1];

  const setHour = (hour: string) => {
    setParams({
      ...params,
      time: `${hour}:${min}`,
    });
  };

  const setMin = (min: string) => {
    setParams({
      ...params,
      time: `${hour}:${min}`,
    });
  };

  return (
    <div className="relative flex items-center">
      <TimeSelect
        value={hour}
        options={hourOptions}
        onSelect={setHour}
        ariaLabel="select hour"
      />
      <span className="mx-1">:</span>
      <TimeSelect
        value={min}
        options={minOptions}
        onSelect={setMin}
        ariaLabel="select minute"
      />
      <div className="absolute -right-14 text-sm">
        <NowTimeButton />
      </div>
    </div>
  );
};

const DatePicker: FC = () => {
  const { i18n } = useTranslation();
  moment.locale(i18n.language === "en" ? "en" : "zh-tw");

  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const { isThsr } = usePage();

  // 為了讓 <此刻> 按鈕方便運作，這邊不使用 useState，而是每次 re-render 時直接取得 params 最新值即可
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
        maxDate={moment().add(isThsr ? 28 : 59, "days")}
        reduceAnimations={true}
        timezone={"Asia/Taipei"}
        dayOfWeekFormatter={(_day, weekday) => `${_day}`}
      />
    </LocalizationProvider>
  );
};

/** 日期選擇器 */
const SelectDatetime: FC = () => {
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
