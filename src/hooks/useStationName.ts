import { PageEnum } from "@/enums/PageEnum";
import { JsyName } from "@/models/jsy-tr-info";
import { getLocalizedStationName } from "@/utils/StationUtils";
import { useTranslation } from "next-i18next";
import { useCallback } from "react";

/** 取得「站號 + 後端站名 → 當前語系站名」的轉換函式 */
const useStationName = (page: PageEnum.TR | PageEnum.THSR | PageEnum.TYMC) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return useCallback(
    (stationId: string | undefined, name: JsyName | undefined): string =>
      getLocalizedStationName(page, stationId, name, lang),
    [page, lang],
  );
};

export default useStationName;
