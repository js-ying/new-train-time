import AdBanner from "@/components/common/AdBanner";
import { GaEnum } from "@/enums/GaEnum";
import { JsyTrTransferInfo } from "@/models/jsy-tr-info";
import { ReportTrainType } from "@/services/reportService";
import AdUtils from "@/utils/AdUtils";
import { gaClickEvent } from "@/utils/GaUtils";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useEffect, useMemo, useState } from "react";
import TrainTimeNavbar from "../../TrainTimeNavbar";
import TrTransferCard from "./TrTransferCard";
import TrTransferDescription from "./TrTransferDescription";
import TrTransferLegCountFilter from "./TrTransferLegCountFilter";
import TrTransferTimeFilter from "./TrTransferTimeFilter";

interface TrTransferTimeTableProps {
  data: JsyTrTransferInfo;
  /** 當前查詢條件；提供完整即可在說明 Dialog 內顯示「錯誤回報」按鈕 */
  reportPayload?: {
    trainType: ReportTrainType;
    startStationId: string;
    endStationId: string;
    date: string;
  };
}

/**
 * 台鐵跨支線轉乘清單容器。佈局：
 *   - 第一行：「全部展開／收合」按鈕 + 右側計數（沿用 TrainTimeNavbar）
 *   - 第二行：「等待時間」「段數」兩個下拉篩選（手機版主因，避免擠成多排）
 *
 * 過濾邏輯集中在這層：兩個 filter 各自 controlled 報告條件，combinations 由 useMemo
 * 統一套用所有條件，避免兩個 filter 互相覆寫結果。
 *
 * expandSignal: 父層 broadcast 給每張卡片的展開指令。signal.key 變化 effect 才觸發，
 * 使用者按全部展開後仍可個別摺收某張卡。
 */
const TrTransferTimeTable: FC<TrTransferTimeTableProps> = ({
  data,
  reportPayload,
}) => {
  const { t } = useTranslation();

  // filter 條件（controlled，由子 dropdown 報告）
  const [waitLimit, setWaitLimit] = useState<number>(Infinity);
  const [legCount, setLegCount] = useState<number | null>(null);

  // 轉乘說明 Dialog 開關（Beta 階段揭露資料涵蓋限制）
  const [descOpen, setDescOpen] = useState(false);

  // 資料中實際出現的段數，用以動態組段數 filter 選項
  const availableLegCounts = useMemo(() => {
    const set = new Set<number>(data.combinations.map((c) => c.legs.length));
    return Array.from(set).sort((a, b) => a - b);
  }, [data.combinations]);

  const filteredCombinations = useMemo(() => {
    return data.combinations.filter((c) => {
      if (legCount !== null && c.legs.length !== legCount) return false;
      if (waitLimit !== Infinity && !c.waitMinutes.every((w) => w < waitLimit))
        return false;
      return true;
    });
  }, [data.combinations, waitLimit, legCount]);

  // 全部展開／收合 signal
  const [expandSignal, setExpandSignal] = useState<{
    value: boolean;
    key: number;
  } | null>(null);
  const [allExpanded, setAllExpanded] = useState(false);

  useEffect(() => {
    // 換資料時 (新的 OD / 模式切回) 重置展開狀態 + 篩選條件
    setExpandSignal(null);
    setAllExpanded(false);
    setWaitLimit(Infinity);
    setLegCount(null);
  }, [data.combinations]);

  const handleToggleAll = () => {
    const next = !allExpanded;
    setAllExpanded(next);
    setExpandSignal({ value: next, key: Date.now() });
  };

  return (
    <>
      <div className="mb-2 py-2">
        {/* 第一行：全部展開／收合 + 計數 */}
        <TrainTimeNavbar
          totalCount={data.combinations.length}
          filterCount={filteredCombinations.length}
        >
          {/* 左側：「全部展開／收合」+「Beta 須知」並排
           *   - 用 flex gap-2 讓兩顆按鈕間距與 TrainTimeNavbar 內 children/count 分開
           *   - Beta 須知用 amber 警示色，搭配 ⚠ icon 引導使用者點開閱讀資料涵蓋限制
           */}
          <div className="flex flex-wrap items-center gap-0">
            <Button
              size="sm"
              radius="sm"
              // gap-1.5 蓋掉 HeroUI Button 預設 gap-2，讓 chevron icon 與文字更貼近
              className="h-8 min-w-fit gap-1.5 bg-neutral-500 text-sm text-white dark:bg-neutral-600"
              // chevron-down 預設指向「可展開」狀態；展開後 rotate-180 變朝上代表「可收合」。
              // 用 rotate 而非切兩個 path，可以吃 transition-transform 做動畫
              startContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className={`size-3 transition-transform duration-200 ${
                    allExpanded ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              }
              onPress={handleToggleAll}
            >
              {allExpanded ? t("transferCollapseAll") : t("transferExpandAll")}
            </Button>

            <Button
              size="sm"
              radius="sm"
              variant="light"
              className="h-8 min-w-fit text-sm text-silverLakeBlue-500 dark:text-gamboge-500"
              onPress={() => {
                gaClickEvent(GaEnum.TR_TRANSFER_DESCRIPTION);
                setDescOpen(true);
              }}
            >
              {t("transferGuideBtn")}
            </Button>
          </div>
        </TrainTimeNavbar>

        {/* 第二行：等待篩選 + 段數篩選
         *  - 手機 (< md)：grid-cols-5 撐滿，等待 col-span-3 (60%)、段數 col-span-2 (40%)
         *  - PC (md+)：md:flex 取代 grid，col-span 失效，filter 用自身 md:w-48 / md:w-32
         */}
        <div className="mt-2 grid grid-cols-5 gap-2 md:flex md:flex-wrap">
          <TrTransferTimeFilter
            selectedLimit={waitLimit}
            onLimitChange={setWaitLimit}
            className="col-span-3 md:w-48"
          />
          <TrTransferLegCountFilter
            availableLegCounts={availableLegCounts}
            selectedLegCount={legCount}
            onLegCountChange={setLegCount}
            className="col-span-2 md:w-32"
          />
        </div>
      </div>

      <TrTransferDescription
        open={descOpen}
        setOpen={setDescOpen}
        reportPayload={reportPayload}
      />

      <div className="flex flex-col gap-4">
        {filteredCombinations.map((combination, index) => {
          const key = combination.legs
            .map((l) => l.trainInfo.trainNo)
            .join("-");
          return (
            <div key={`${key}-${index}`}>
              <TrTransferCard
                combination={combination}
                trainDate={data.trainDate}
                expandSignal={expandSignal}
              />

              {AdUtils.showAd(filteredCombinations.length, index) && (
                <div className="mt-4 empty:hidden">
                  <AdBanner></AdBanner>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TrTransferTimeTable;
