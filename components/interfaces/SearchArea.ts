import { Dispatch, SetStateAction } from "react";

export interface SwitchArrowButtonParams {
  className?: string;
}

export interface AreaParams {
  children: React.ReactNode;
  isActive: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
}

export interface SearchAreaParams {
  startStation: string;
  endStation: string;
  datetime: string;
  stationList: string[];
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
}
