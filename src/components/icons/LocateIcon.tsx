import { FC } from "react";

/** 定位 / 準星 icon（離我最近車站按鈕用） */
const LocateIcon: FC<{ className: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2.25v2.25m0 15v2.25M21.75 12H19.5m-15 0H2.25"
      />
      <circle cx="12" cy="12" r="6.75" />
      <circle cx="12" cy="12" r="1.75" />
    </svg>
  );
};

export default LocateIcon;
