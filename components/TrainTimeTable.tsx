import { PageEnum } from "../enums/Page";

/** 高鐵時刻資訊 */
const ThsrTimeInfo = ({ data }) => {
  return <></>;
};

/** 台鐵時刻資訊 */
const TrTimeInfo = ({ data }) => {
  return (
    <div
      className="flex h-16 cursor-pointer flex-col items-center justify-center
        rounded-md border border-solid border-zinc-700 p-2 transition
        duration-150 ease-out dark:border-zinc-200"
    >
      asd
    </div>
  );
};

/** 列車時刻表 */
const TrainTimeTable = ({
  page,
  dataList,
}: {
  page: PageEnum;
  dataList: any[];
}) => {
  const isTr = page === PageEnum.TR;
  const isThsr = page === PageEnum.THSR;

  return (
    <div className="flex flex-col gap-4">
      {dataList.map((data, index) => (
        <div key={index}>
          {isTr && <TrTimeInfo data={data} />}
          {isThsr && <ThsrTimeInfo data={data} />}
        </div>
      ))}
    </div>
  );
};

export default TrainTimeTable;
