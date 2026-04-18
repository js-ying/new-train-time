import CommonDialog from "@/components/common/CommonDialog";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";

interface FeedbackDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

/** 意見反應 Dialog：引導使用者到 Google 表單填寫回饋 */
const FeedbackDialog: FC<FeedbackDialogProps> = ({ open, setOpen }) => {
  const { t } = useTranslation();

  return (
    <CommonDialog
      open={open}
      setOpen={setOpen}
      title={t("feedbackMenu")}
      bodyTextAlign="text-left"
    >
      <div className="flex flex-col justify-center">
        <div className="mb-6 text-left">{t("feedbackDescription")}</div>
        <div className="flex justify-center">
          <Button
            color="primary"
            className="w-fit bg-silverLakeBlue-500 text-white dark:bg-gamboge-500 dark:text-eerieBlack-500"
            onPress={() =>
              window.open("https://forms.gle/y9VGhdMwMhbiZVW88", "_blank")
            }
          >
            {t("feedbackBtn")}
          </Button>
        </div>
      </div>
    </CommonDialog>
  );
};

export default FeedbackDialog;
