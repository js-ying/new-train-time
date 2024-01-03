const TrTrainType = ({ code, trainTypeName }) => {
  return (
    <>
      {/* 自強 */}
      {["3", "11"].includes(code) && (
        <span className={"rounded bg-teal-500 px-1 py-0.5 text-white"}>
          {trainTypeName}
        </span>
      )}

      {/* 區間 */}
      {["6", "7", "10"].includes(code) && (
        <span className={"rounded bg-sky-500 px-1 py-0.5 text-white"}>
          {trainTypeName}
        </span>
      )}

      {/* 大魯閣 */}
      {["1"].includes(code) && (
        <span className={"rounded bg-indigo-500 px-1 py-0.5 text-white"}>
          {trainTypeName}
        </span>
      )}

      {/* 普悠瑪 */}
      {["2"].includes(code) && (
        <span className={"rounded bg-rose-500 px-1 py-0.5 text-white"}>
          {trainTypeName}
        </span>
      )}

      {/* 莒光號 */}
      {["4"].includes(code) && (
        <span className={"rounded bg-amber-500 px-1 py-0.5 text-white"}>
          {trainTypeName}
        </span>
      )}

      {/* 復興 */}
      {["5"].includes(code) && (
        <span className={"rounded bg-amber-500 px-1 py-0.5 text-white"}>
          {trainTypeName}
        </span>
      )}
    </>
  );
};

export default TrTrainType;
