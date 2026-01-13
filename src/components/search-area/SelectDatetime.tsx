import { FC } from "react";
import DatePicker from "./datetime/DatePicker";
import TimePicker from "./datetime/TimePicker";

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
