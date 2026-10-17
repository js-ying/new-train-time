import CommonAlert from "@/components/common/CommonAlert";
import { FC, ReactNode } from "react";

interface BusEmptyNoticeProps {
  children: ReactNode;
  className?: string;
}

/** [公車] 無資料提示：比照三鐵 NoTrainData 的 warning Alert */
const BusEmptyNotice: FC<BusEmptyNoticeProps> = ({ children, className }) => (
  <CommonAlert severity="warning" className={className}>
    <div className="font-bold">{children}</div>
  </CommonAlert>
);

export default BusEmptyNotice;
