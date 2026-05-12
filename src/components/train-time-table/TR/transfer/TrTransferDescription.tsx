import CommonDialog from "@/components/common/CommonDialog";
import { useTranslation } from "next-i18next";
import { FC } from "react";

interface TrTransferDescriptionProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

/** 台鐵轉乘說明 Dialog（Beta 期間使用，向使用者揭露資料涵蓋限制與回饋管道） */
const TrTransferDescription: FC<TrTransferDescriptionProps> = ({
  open,
  setOpen,
}) => {
  const { t } = useTranslation();
  // i18n 以陣列回傳多段公告，逐段渲染保留段落空白
  const paragraphs = t("announcementTrTransferV1", {
    returnObjects: true,
  }) as string[];

  return (
    <CommonDialog
      open={open}
      setOpen={setOpen}
      title="trTransferDescription"
      bodyTextAlign="text-left"
      size="md"
    >
      <div className="flex flex-col gap-4">
        {paragraphs.map((text, index) => {
          // 最後一段為「免責提醒」，使用灰字呈現
          const isLast = index === paragraphs.length - 1;
          return (
            <p
              key={index}
              className={
                isLast ? "text-zinc-500 dark:text-zinc-400" : undefined
              }
            >
              {text}
            </p>
          );
        })}
      </div>
    </CommonDialog>
  );
};

export default TrTransferDescription;
