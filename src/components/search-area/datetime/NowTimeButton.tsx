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
      className="h-7 min-w-fit px-2 text-xs"
      size="sm"
      radius="sm"
      color="primary"
      onPress={resetDateTime}
    >
      {t("nowTimeBtn")}
    </Button>
  );
};

export default NowTimeButton;
