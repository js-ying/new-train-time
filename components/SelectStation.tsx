import { useRouter } from "next/router";
import { trMainLines, trStationDataList } from "../assets/data/stationsData";

const CustomInput = ({ placeholder }) => {
  return (
    <input
      type="input"
      className="text-zinc-700 border border-gray-300 rounded-md outline-none
      w-full px-3 py-1.5
      transition duration-150 ease-out 
      dark:bg-gray-100
      focus:border-gray-400 dark:focus:border-gray-600
      focus:ring focus:ring-gray-300 dark:focus:ring-gray-500"
      placeholder={placeholder}
    ></input>
  );
};

const CustomButton = ({ text }) => {
  return (
    <div
      className="px-3 py-2 w-full text-center text-white cursor-pointer rounded
        transition duration-150 ease-out
      bg-neutral-500 dark:bg-neutral-600 
      hover:bg-neutral-500/80 hover:dark:bg-neutral-600/80"
    >
      {text}
    </div>
  );
};

export default function SelectStation() {
  const router = useRouter();
  const isTr = router.pathname.includes("TR");
  const isThsr = router.pathname.includes("THSR");

  return (
    <>
      <CustomInput placeholder="出發車站（e.g. 新竹）" />

      {isTr && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {trMainLines.map((station) => (
            <CustomButton text={station.Zh_tw} key={station.En} />
          ))}
        </div>
      )}

      {isThsr && <div></div>}
    </>
  );
}
