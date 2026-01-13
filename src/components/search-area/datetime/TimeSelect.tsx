import { FC } from "react";

interface TimeSelectProps {
  value: string;
  options: { key: string; label: string }[];
  onSelect: (val: string) => void;
}

const TimeSelect: FC<TimeSelectProps> = ({ value, options, onSelect }) => {
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

export default TimeSelect;
