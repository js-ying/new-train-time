import { useTranslation } from "next-i18next";
import { FC, useMemo } from "react";
import { JsyThsrFreeSeatingCar } from "../../../models/jsy-thsr-info";

interface FreeSeatingCarNo {
  startCar: string;
  endCar: string;
  trainNo: string;
}

const getFreeSeatGroupListByTrainNo = (
  dataList: JsyThsrFreeSeatingCar[],
  trainNo: string,
): FreeSeatingCarNo[] => {
  if (dataList && dataList.length > 0) {
    const freeSeatingCar = dataList.find(
      (data) => String(data.trainNo).padStart(4, "0") === trainNo,
    );
    if (freeSeatingCar?.carConfig) {
      const groupList = freeSeatingCar.carConfig.split(" ")[1].split(",");
      return groupList.map((group) => {
        return {
          startCar: group.split("-")[0].padStart(1, "0"),
          endCar: group.split("-")[1].padStart(1, "0"),
          trainNo: trainNo,
        };
      });
    }
  }

  return [];
};

interface TextFreeSeatProps {
  freeSeatGroupList: FreeSeatingCarNo[];
}

const TextFreeSeat: FC<TextFreeSeatProps> = ({ freeSeatGroupList }) => {
  const { t } = useTranslation();
  const textFreeSeatGroupList = freeSeatGroupList.map((group) => {
    return group.startCar + "-" + group.endCar;
  });

  return (
    <div>
      {textFreeSeatGroupList.length > 0
        ? textFreeSeatGroupList.join(t("comma"))
        : t("confirmOnSiteMsg")}
    </div>
  );
};

interface LabelFreeSeatSpanProps {
  carNo: string;
}

const LabelFreeSeatSpan: FC<LabelFreeSeatSpanProps> = ({ carNo }) => {
  return (
    <span
      className="h-4 w-4 rounded-md bg-primary text-xs
      leading-4 text-primary-foreground transition duration-150
      ease-out"
    >
      {carNo}
    </span>
  );
};

interface LabelFreeSeatProps {
  freeSeatGroupList: FreeSeatingCarNo[];
}

const LabelFreeSeat: FC<LabelFreeSeatProps> = ({ freeSeatGroupList }) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-3">
      {freeSeatGroupList.length > 0 ? (
        freeSeatGroupList.map((group) => {
          return (
            <div
              className="flex items-center justify-center gap-1 text-center"
              key={`${group.trainNo}${group.startCar}-${group.endCar}`}
            >
              <LabelFreeSeatSpan carNo={group.startCar} />
              -
              <LabelFreeSeatSpan carNo={group.endCar} />
            </div>
          );
        })
      ) : (
        <div className="text-muted-foreground">
          {t("confirmOnSiteMsg")}
        </div>
      )}
    </div>
  );
};

interface ThsrFreeSeatProps {
  freeSeatData: JsyThsrFreeSeatingCar[];
  trainNo: string;
  showLabel: boolean;
}

const ThsrFreeSeat: FC<ThsrFreeSeatProps> = ({
  freeSeatData,
  trainNo,
  showLabel,
}) => {
  const freeSeatGroupList = useMemo(() => {
    return getFreeSeatGroupListByTrainNo(freeSeatData, trainNo);
  }, [freeSeatData, trainNo]);

  return showLabel ? (
    <LabelFreeSeat freeSeatGroupList={freeSeatGroupList} />
  ) : (
    <TextFreeSeat freeSeatGroupList={freeSeatGroupList} />
  );
};

export default ThsrFreeSeat;
