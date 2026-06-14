import { useTranslation } from "next-i18next";
import { FC } from "react";
import CommonDialog from "../common/CommonDialog";

interface OrderDescriptionProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

/** 訂票說明彈窗內容（table 前後為 i18n 文字段落） */
const AnnouncementContent: FC = () => {
  const { t } = useTranslation();
  const translatedTexts = t("announcementTrOrderV1", {
    returnObjects: true,
  }) as string[];

  return (
    <div className="flex flex-col gap-4">
      {translatedTexts.map((text, index) => {
        if (text === "__TABLE__") {
          return (
            <div key={index} className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700">
                    <th className="py-2 pr-3 text-left font-semibold">
                      {t("railway")}
                    </th>
                    <th className="px-3 py-2 font-semibold">
                      <span className="flex justify-center text-center">
                        {t("realTimeSeatData")}
                      </span>
                    </th>
                    <th className="px-3 py-2 font-semibold">
                      <span className="flex justify-center text-center">
                        {t("bookingBtnCondition")}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700">
                    <td className="py-2 pr-3 font-medium">{t("tr")}</td>
                    <td className="px-3 py-2">
                      <span className="flex justify-center text-center text-orange-500 dark:text-orange-400">
                        {t("waitingForTdx")}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="flex justify-center text-center">
                        {t("alwaysShow")}
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700">
                    <td className="py-2 pr-3 font-medium">{t("thsr")}</td>
                    <td className="px-3 py-2">
                      <span className="flex justify-center text-center text-emerald-600 dark:text-emerald-400">
                        {t("seatDataConnected")}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="flex justify-center text-center">
                        {t("showWhenSeatsAvailable")}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        }
        return <p key={index}>{text}</p>;
      })}
    </div>
  );
};

/** 訂票說明 Dialog（由呼叫端控制開關） */
const OrderDescription: FC<OrderDescriptionProps> = ({ open, setOpen }) => {
  return (
    <CommonDialog
      open={open}
      setOpen={setOpen}
      title="trOrderDescription"
      bodyTextAlign="text-left"
      size="md"
    >
      <AnnouncementContent />
    </CommonDialog>
  );
};

export default OrderDescription;
