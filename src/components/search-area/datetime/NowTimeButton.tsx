import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import DateUtils from "@/utils/DateUtils";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useContext } from "react";

const NowTimeButton: FC = () => {
  const { t } = useTranslation();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);

  const resetDateTime = () => {
    setParams({
      ...params,
      date: DateUtils.getCurrentDate(),
      time: DateUtils.getCurrentTime(),
    });
  };

  return (
    <Button
      className="text-md min-w-fit text-silverLakeBlue-500 dark:text-gamboge-500"
      variant="light"
      size="sm"
      onPress={resetDateTime}
    >
      {t("nowTimeBtn")}
    </Button>
  );
};

export default NowTimeButton;
