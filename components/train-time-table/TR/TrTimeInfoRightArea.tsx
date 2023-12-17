import { TrTrainTimeTable } from "../../../types/tr-train-time-table";

const TrTimeInfoRightArea = ({
  data,
  lang,
}: {
  data: TrTrainTimeTable;
  lang: string;
}) => {
  return (
    <>
      <span title="全票票價" className="text-sm">
        NTD {data.fareList.length > 0 && data.fareList[0].Price}
      </span>
    </>
  );
};

export default TrTimeInfoRightArea;
