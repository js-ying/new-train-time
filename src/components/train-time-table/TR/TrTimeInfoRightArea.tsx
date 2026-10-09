import { JsyTrTimetable } from "@/models/jsy-tr-info";

import { useTranslation } from "next-i18next";
import { FC } from "react";
import TrOrder, { isShowTrOrderBtn } from "./TrOrder";

interface TrTimeInfoRightAreaProps {
  data: JsyTrTimetable;
}

const TrTimeInfoRightArea: FC<TrTimeInfoRightAreaProps> = ({ data }) => {
  const { t } = useTranslation();
  return (
    <div className={`flex flex-col gap-0.5`}>
      {data.fareList.length > 0 && (
        <span className="text-sm">
          {t("fareAmount", { price: data.fareList[0].price })}
        </span>
      )}

      {isShowTrOrderBtn(data) && <TrOrder data={data} />}
    </div>
  );
};

export default TrTimeInfoRightArea;
