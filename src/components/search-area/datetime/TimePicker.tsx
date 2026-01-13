import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import { FC, useContext, useMemo } from "react";
import NowTimeButton from "./NowTimeButton";
import TimeSelect from "./TimeSelect";

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

  const hour = params.time?.split(":")[0];
  const min = params.time?.split(":")[1];

  const setHour = (newHour: string) => {
    setParams({
      ...params,
      time: `${newHour}:${min}`,
    });
  };

  const setMin = (newMin: string) => {
    setParams({
      ...params,
      time: `${hour}:${newMin}`,
    });
  };

  return (
    <div className="relative flex items-center">
      <TimeSelect value={hour} options={hourOptions} onSelect={setHour} />
      <span className="mx-1">:</span>
      <TimeSelect value={min} options={minOptions} onSelect={setMin} />
      <div className="absolute -right-14 text-sm">
        <NowTimeButton />
      </div>
    </div>
  );
};

export default TimePicker;
