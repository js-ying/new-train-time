import QueryCooldownDialog from "@/components/common/QueryCooldownDialog";
import LocateIcon from "@/components/icons/LocateIcon";
import Area from "@/components/search-area/Area";
import StationButton from "@/components/search-area/station/StationButton";
import { trMainLines, trStationDataList } from "@/data/stationsData";
import useRefreshCooldown, {
  QUERY_COOLDOWN_MS,
} from "@/hooks/useRefreshCooldown";
import useRwd from "@/hooks/useRwd";
import { getTdxLang } from "@/utils/LocaleUtils";
import {
  getNearestTrStation,
  getTrStationNameById,
  isTrStationInCounty,
  isTrStationMatchInput,
} from "@/utils/StationUtils";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import {
  FC,
  ReactNode,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface TrStationPickerProps {
  selectedStationId: string | null;
  onSelectStation: (stationId: string) => void;
  /** 掛在「離我最近車站」同列最右側的動作槽（如刷新 icon、未來的收藏愛心）；absolute 不影響按鈕置中 */
  rightSlot?: ReactNode;
}

/**
 * [台鐵] 單站時刻表的車站選擇器（滿版）。
 * 自帶 local state（不依賴 OD 的 SearchAreaContext / 起訖站模型）：
 * 縣市分層 + 搜尋過濾 + 「離我最近車站」定位。
 */
const TrStationPicker: FC<TrStationPickerProps> = ({
  selectedStationId,
  onSelectStation,
  rightSlot,
}) => {
  const { t, i18n } = useTranslation();
  const { isMobile } = useRwd();
  const lang = getTdxLang(i18n.language);

  // 預設收合（不主動 active）；點開才展開選單
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [county, setCounty] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const deferredInput = useDeferredValue(inputValue);
  const inputRef = useRef<HTMLInputElement>(null);
  // 冷卻內重選同一站擋下（防連點 / 同查詢重洗 SSR+後端），比照 OD 送出節流
  const cooldown = useRefreshCooldown(QUERY_COOLDOWN_MS);

  // 展開選單時，電腦版自動 focus 搜尋框（比照 OD 起迄站查詢）
  useEffect(() => {
    if (isOpen && !isMobile) inputRef.current?.focus();
  }, [isOpen, isMobile]);

  const selectedName = selectedStationId
    ? getTrStationNameById(selectedStationId, i18n.language)
    : null;

  const select = (stationId: string) => {
    // 冷卻內重選同一站 → 擋下並提示（三入口：站名 button / input / 最近車站都經此）
    cooldown.attempt(
      () => {
        onSelectStation(stationId);
        setIsOpen(false);
        setInputValue("");
        setCounty(null);
        setGeoError(null);
      },
      { key: stationId },
    );
  };

  // 搜尋框按 Enter（沿用 OD StationInputs 規則）：
  //   - 篩剩 2 站且其一為大站(StationClass 0/1) → 優先查大站
  //     （如輸入「新竹」會同時命中 新竹 + 北新竹，優先選大站新竹）
  //   - 否則僅在篩剩 1 站時才生效
  const handleInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const matched = trStationDataList.filter((s) =>
      isTrStationMatchInput(s, inputValue),
    );
    if (matched.length === 2) {
      const topStation = matched.find((s) =>
        ["0", "1"].includes(s.StationClass),
      );
      if (topStation) {
        select(topStation.StationID);
        return;
      }
    }
    if (matched.length === 1) {
      select(matched[0].StationID);
    }
  };

  const filteredStations = useMemo(() => {
    if (deferredInput) {
      return trStationDataList.filter((s) =>
        isTrStationMatchInput(s, deferredInput),
      );
    }
    if (county) {
      return trStationDataList.filter((s) => isTrStationInCounty(s, county));
    }
    return [];
  }, [deferredInput, county]);

  const handleLocate = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoError(t("trStationGeoUnsupported"));
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const nearest = getNearestTrStation(
          pos.coords.latitude,
          pos.coords.longitude,
        );
        if (nearest) select(nearest);
        else setGeoError(t("trStationGeoFailed"));
      },
      () => {
        setLocating(false);
        setGeoError(t("trStationGeoDenied"));
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {/* 出發車站滿版（寬度由外層置中欄 max-w 收斂，手機版自然全寬） */}
      <Area
        className="mx-auto w-full md:max-w-[342px]"
        isActive={isOpen}
        onClick={() => setIsOpen((v) => !v)}
      >
        {t("startStation")}
        <div>{selectedName ?? ""}</div>
      </Area>

      <div className="relative flex w-full justify-center">
        <Button
          isIconOnly
          variant="light"
          aria-label={t("trStationNearestButton")}
          onPress={handleLocate}
        >
          <LocateIcon className="h-4 w-4" />
        </Button>
        {rightSlot && (
          <div className="absolute inset-y-0 right-0 flex items-center">
            {rightSlot}
          </div>
        )}
      </div>

      {geoError && (
        <div className="mb-3 text-center text-xs text-danger">
          {geoError}
        </div>
      )}

      {/* 選站區：縣市分層 + 搜尋 */}
      {isOpen && (
        <div>
          <input
            ref={inputRef}
            type="input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputEnter}
            className="common-input"
            placeholder={t("trStationSearchPlaceholder")}
          />
          <div className="mb-3 mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {!deferredInput &&
              !county &&
              trMainLines.map((line) => (
                <StationButton
                  key={line.En}
                  text={line[lang]}
                  value={line.Zh_tw}
                  onSelect={(c) => setCounty(c)}
                />
              ))}
            {(deferredInput || county) &&
              filteredStations.map((s) => (
                <StationButton
                  key={s.StationName.En}
                  text={s.StationName[lang]}
                  value={s.StationID}
                  onSelect={select}
                  isTopStation={["0", "1"].includes(s.StationClass)}
                />
              ))}
          </div>
        </div>
      )}

      {/* 同站快速重選提示 */}
      <QueryCooldownDialog cooldown={cooldown} />
    </div>
  );
};

export default TrStationPicker;
