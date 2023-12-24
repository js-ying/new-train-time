import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { TrTrainInfo } from "../../../types/tr-train-time-table";

export const trTrainServiceList = [
  {
    imgName: "disability",
    flagName: "WheelChairFlag",
    description: "身障旅客專用座位車",
  },
  {
    imgName: "suitcase",
    flagName: "PackageServiceFlag",
    description: "行李服務",
  },
  {
    imgName: "bento",
    flagName: "DiningFlag",
    description: "訂便當服務",
  },
  {
    imgName: "mother",
    flagName: "BreastFeedFlag",
    description: "哺(集)乳室車廂",
  },
  {
    imgName: "bicycle",
    flagName: "BikeFlag",
    description: "人車同行",
  },
  {
    imgName: "train",
    flagName: "ExtraTrainFlag",
    description: "為加班車",
  },
];

const TrTrainService = ({ data }: { data: TrTrainInfo }) => {
  const { t } = useTranslation();

  return (
    <>
      {trTrainServiceList.map((service) => {
        if (data[service.flagName] === 1) {
          return (
            <Tooltip
              title={t(`trainService${service.flagName}`)}
              arrow
              placement="top"
              key={service.flagName}
            >
              <Image
                src={`/images/icons/${service.imgName}.png`}
                alt={t(`trainService${service.flagName}`)}
                width={15}
                height={15}
                key={service.flagName}
              />
            </Tooltip>
          );
        }

        return null;
      })}
    </>
  );
};

export default TrTrainService;
