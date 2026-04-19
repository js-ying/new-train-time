import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { FC } from "react";
import { JsyTrTrainInfo } from "../../../models/jsy-tr-info";

export const trTrainServiceList: {
  imgName: string;
  flagName: keyof Pick<
    JsyTrTrainInfo,
    | "wheelChairFlag"
    | "packageServiceFlag"
    | "diningFlag"
    | "breastFeedFlag"
    | "bikeFlag"
    | "extraTrainFlag"
  >;
  i18nKey: string;
  description: string;
}[] = [
  {
    imgName: "disability",
    flagName: "wheelChairFlag",
    i18nKey: "trainServiceWheelChairFlag",
    description: "身障旅客專用座位車",
  },
  {
    imgName: "suitcase",
    flagName: "packageServiceFlag",
    i18nKey: "trainServicePackageServiceFlag",
    description: "行李服務",
  },
  {
    imgName: "bento",
    flagName: "diningFlag",
    i18nKey: "trainServiceDiningFlag",
    description: "訂便當服務",
  },
  {
    imgName: "mother",
    flagName: "breastFeedFlag",
    i18nKey: "trainServiceBreastFeedFlag",
    description: "哺(集)乳室車廂",
  },
  {
    imgName: "bicycle",
    flagName: "bikeFlag",
    i18nKey: "trainServiceBikeFlag",
    description: "人車同行",
  },
  {
    imgName: "train",
    flagName: "extraTrainFlag",
    i18nKey: "trainServiceExtraTrainFlag",
    description: "為加班車",
  },
];

interface TrTrainServiceProps {
  data: JsyTrTrainInfo;
}

const TrTrainService: FC<TrTrainServiceProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <>
      {trTrainServiceList.map((service) => {
        if (data[service.flagName] === 1) {
          return (
            <Tooltip
              title={t(service.i18nKey)}
              arrow
              placement="top"
              key={service.flagName}
            >
              <Image
                src={`/images/icons/${service.imgName}.png`}
                alt={t(service.i18nKey)}
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
