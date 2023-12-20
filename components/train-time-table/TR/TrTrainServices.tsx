import Image from "next/image";
import { useMemo } from "react";
import { TrTrainInfo } from "../../../types/tr-train-time-table";

const TrTrainService = ({ data }: { data: TrTrainInfo }) => {
  const serviceList = useMemo(() => {
    return [
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
        imgName: "lunch",
        flagName: "DiningFlag",
        description: "訂便當服務",
      },
      {
        imgName: "breast-feeding",
        flagName: "BreastFeedFlag",
        description: "哺(集)乳室車廂",
      },
      {
        imgName: "bicycle",
        flagName: "BikeFlag",
        description: "人車同行",
      },
      {
        imgName: "car",
        flagName: "CarFlag",
        description: "小汽車上火車",
      },
      {
        imgName: "train",
        flagName: "ExtraTrainFlag",
        description: "為加班車",
      },
    ];
  }, []);

  return (
    <>
      {serviceList.map((service) => {
        if (data[service.flagName] === 1) {
          return (
            <Image
              src={`/images/icons/${service.imgName}.png`}
              alt={service.description}
              width={15}
              height={15}
            />
          );
        }

        return null;
      })}
    </>
  );
};

export default TrTrainService;
