import { Dispatch, SetStateAction } from "react";

export interface LayoutParams {
  children: React.ReactNode;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  title?: string;
}
