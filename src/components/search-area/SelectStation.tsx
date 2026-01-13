import usePage from "@/hooks/usePage";
import { FC } from "react";
import {
  ThsrStationInput,
  TrStationInput,
  TymcStationInput,
} from "./station/StationInputs";
import {
  SelectThsrStation,
  SelectTrStation,
  SelectTymcStation,
} from "./station/StationSelectors";

/** 車站選擇器 */
const SelectStation: FC = () => {
  const { isTr, isThsr, isTymc } = usePage();

  return (
    <>
      {isTr && <TrStationInput />}
      {isThsr && <ThsrStationInput />}
      {isTymc && <TymcStationInput />}

      {isTr && <SelectTrStation />}
      {isThsr && <SelectThsrStation />}
      {isTymc && <SelectTymcStation />}
    </>
  );
};

export default SelectStation;
