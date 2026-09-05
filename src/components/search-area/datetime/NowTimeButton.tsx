import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import { SearchSubmitContext } from "@/contexts/SearchSubmitContext";
import DateUtils from "@/utils/DateUtils";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useContext } from "react";

const NowTimeButton: FC = () => {
  const { t } = useTranslation();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);
  const submitSearch = useContext(SearchSubmitContext);

  const resetDateTime = () => {
    const date = DateUtils.getCurrentDate();
    const time = DateUtils.getCurrentTime();

    setParams({ ...params, date, time });

    // 起訖站都選好才順帶送出；新的日期時間直接帶參數，不等 context 更新
    if (params.startStationId && params.endStationId) {
      submitSearch({ date, time });
    }
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
