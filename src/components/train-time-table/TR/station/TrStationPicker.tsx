import CommonDialog from "@/components/common/CommonDialog";
import LocateIcon from "@/components/icons/LocateIcon";
import Area from "@/components/search-area/Area";
import StationButton from "@/components/search-area/station/StationButton";
import { trMainLines, trStationDataList } from "@/data/stationsData";
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
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface TrStationPickerProps {
  selectedStationId: string | null;
  onSelectStation: (stationId: string) => void;
}

/**
 * [台鐵] 單站時刻表的車站選擇器（滿版）。
 * 自帶 local state（不依賴 OD 的 SearchAreaContext / 起訖站模型）：
 * 縣市分層 + 搜尋過濾 + 「離我最近車站」定位。
 */
const TrStationPicker: FC<TrStationPickerProps> = ({
  selectedStationId,
  onSelectStation,
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
  const [sameQueryOpen, setSameQueryOpen] = useState(false);
  const deferredInput = useDeferredValue(inputValue);
  const inputRef = useRef<HTMLInputElement>(null);
  // 5 秒內重選同一站擋下（防連點 / 同查詢重洗 SSR+後端），比照 OD sameQueryMsg
  const lastQueryRef = useRef<{ id: string; time: number } | null>(null);
  const queryInterval = 5000;

  // 展開選單時，電腦版自動 focus 搜尋框（比照 OD 起迄站查詢）
  useEffect(() => {
    if (isOpen && !isMobile) inputRef.current?.focus();
  }, [isOpen, isMobile]);

  const selectedName = selectedStationId
    ? getTrStationNameById(selectedStationId, i18n.language)
    : null;

  const select = (stationId: string) => {
    // 同一站於 queryInterval 內重選 → 擋下並提示（三入口：站名 button / input / 最近車站都經此）
    const now = Date.now();
    const last = lastQueryRef.current;
    if (last && last.id === stationId && now - last.time < queryInterval) {
      setSameQueryOpen(true);
      return;
    }
    lastQueryRef.current = { id: stationId, time: now };
    onSelectStation(stationId);
    setIsOpen(false);
    setInputValue("");
    setCounty(null);
    setGeoError(null);
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

      {/* 離我最近車站 */}
      <div className="flex justify-center">
        <Button
          variant="light"
          className="text-sm"
          startContent={<LocateIcon className="h-4 w-4" />}
          onPress={handleLocate}
        >
          {t("trStationNearestButton")}
        </Button>
      </div>

      {geoError && (
        <div className="text-center text-xs text-danger">{geoError}</div>
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

      {/* 同站快速重選提示（比照 OD sameQueryMsg） */}
      <CommonDialog open={sameQueryOpen} setOpen={setSameQueryOpen}>
        {t("sameQueryMsg")}
      </CommonDialog>
    </div>
  );
};

export default TrStationPicker;
