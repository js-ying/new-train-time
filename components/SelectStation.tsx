import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { trMainLines, trStationDataList } from "../public/data/stationsData";
import { GetTdxLang } from "../utils/locale-utils";

const CustomInput = ({ placeholder }) => {
  return (
    <input
      type="input"
      className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-zinc-700 outline-none
        transition duration-150 ease-out
        focus:border-gray-400 focus:ring focus:ring-gray-300 
        dark:bg-gray-100 dark:focus:border-gray-600 dark:focus:ring-gray-500"
      placeholder={placeholder}
    ></input>
  );
};

const CustomButton = ({ text }) => {
  return (
    <div
      className="w-full cursor-pointer rounded bg-neutral-500 px-3 py-2 text-center
      text-white transition duration-150
        ease-out hover:bg-neutral-500/80 
      dark:bg-neutral-600 hover:dark:bg-neutral-600/80"
    >
      {text}
    </div>
  );
};

export default function SelectStation() {
  const router = useRouter();
  const isTr = router.pathname.includes("TR");
  const isThsr = router.pathname.includes("THSR");
  const { t } = useTranslation();

  return (
    <>
      <CustomInput placeholder={t("startStationInputPlaceholder")} />

      {isTr && (
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {trMainLines.map((station) => (
            <CustomButton text={station[GetTdxLang()]} key={station.En} />
          ))}
        </div>
      )}

      {isThsr && <div></div>}
    </>
  );
}
