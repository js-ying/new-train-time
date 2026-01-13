import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import { Button } from "@heroui/react";
import { FC, useContext } from "react";

interface SwitchButtonProps {
  className?: string;
}

/** 車站互換按鈕 */
const SwitchButton: FC<SwitchButtonProps> = ({ className = "" }) => {
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  return (
    <Button
      size="sm"
      variant="light"
      className={`${className} min-w-fit px-0 text-zinc-700 dark:text-zinc-200 sm:px-1.5`}
      onPress={() =>
        setParams({
          ...params,
          startStationId: params.endStationId,
          endStationId: params.startStationId,
        })
      }
      aria-label="station-switch-btn"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
        />
      </svg>
    </Button>
  );
};

export default SwitchButton;
