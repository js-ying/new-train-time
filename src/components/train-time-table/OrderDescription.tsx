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
            <div
              key={index}
              className="overflow-hidden rounded-md border border-border"
            >
              <table className="w-full text-center text-sm">
                <thead className="bg-muted">
                  <tr className="border-b border-border">
                    <th className="border-r border-border p-2">
                      {t("railway")}
                    </th>
                    <th className="border-r border-border p-2">
                      {t("realTimeSeatData")}
                    </th>
                    <th className="p-2">{t("bookingBtnCondition")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="border-r border-border p-2 font-bold">
                      {t("tr")}
                    </td>
                    <td className="border-r border-border p-2 text-orange-600 dark:text-orange-400">
                      {t("waitingForTdx")}
                    </td>
                    <td className="p-2">{t("alwaysShow")}</td>
                  </tr>
                  <tr>
                    <td className="border-r border-border p-2 font-bold">
                      {t("thsr")}
                    </td>
                    <td className="border-r border-border p-2 text-emerald-600 dark:text-emerald-400">
                      {t("seatDataConnected")}
                    </td>
                    <td className="p-2">{t("showWhenSeatsAvailable")}</td>
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
