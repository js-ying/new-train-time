import usePage from "@/hooks/usePage";
import useSearchAreaParams from "@/hooks/useSearchAreaParams";
import { getStationNameById } from "@/utils/StationUtils";
import { useTranslation } from "next-i18next";
import { FC } from "react";

/**
 * 搜尋結果頁面的 SEO 動態內容組件。
 * 透過 sr-only 樣式隱藏，僅供搜尋引擎爬蟲 (SEO) 與螢幕閱讀器讀取，
 * 確保搜尋結果能被正確索引並提供無障礙資訊。
 */
const SearchResultSeoContent: FC = () => {
  const { urlSearchAreaParams } = useSearchAreaParams();
  const { page } = usePage();
  const { t, i18n } = useTranslation();
  const { startStationId, endStationId } = urlSearchAreaParams;

  let seoStartStationName = "";
  let seoEndStationName = "";

  if (startStationId && endStationId) {
    seoStartStationName = getStationNameById(
      page,
      startStationId,
      i18n.language,
    );
    seoEndStationName = getStationNameById(page, endStationId, i18n.language);
  }

  // 預渲染站點標題 (僅供螢幕閱讀器與爬蟲讀取)
  if (!seoStartStationName || !seoEndStationName) return null;

  return (
    <div className="sr-only">
      <h2>
        {`${t("stationToStationTimeTableTitle", {
          startStation: seoStartStationName,
          endStation: seoEndStationName,
        })} - ${t(page + "Title")}`}
      </h2>
      <p>
        {t(`${page.toLowerCase()}SearchPageDynamicDescription`, {
          startStation: seoStartStationName,
          endStation: seoEndStationName,
          page: t(page),
        })}
      </p>
    </div>
  );
};

export default SearchResultSeoContent;
