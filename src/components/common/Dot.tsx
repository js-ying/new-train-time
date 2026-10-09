import { FC } from "react";

interface DotProps {
  className?: string;
}

/** 強調站點的圓點標記（行內排列，與站名並排不重疊） */
const Dot: FC<DotProps> = ({ className = "" }) => {
  return (
    <span className={`size-2 shrink-0 rounded-full bg-primary ${className}`} />
  );
};

export default Dot;
