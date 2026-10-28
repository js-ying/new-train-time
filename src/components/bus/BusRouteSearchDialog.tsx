import BusRouteKeypad, { KeyboardIcon } from "@/components/bus/BusRouteKeypad";
import BusRouteSuggestionList, {
  BUS_ROUTE_LISTBOX_ID,
  busRouteOptionId,
} from "@/components/bus/BusRouteSuggestionList";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@/components/common/SwipeableModal";
import { BUS_ROUTE_QUERY_MAX_LEN } from "@/hooks/search/useBusRouteSearch";
import { JsyBusRoute } from "@/models/jsy-bus-info";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import {
  FC,
  KeyboardEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface BusRouteSearchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  inputValue: string;
  onInputChange: (v: string) => void;
  suggestions: JsyBusRoute[];
  /** 產生 suggestions 的查詢字串；與輸入不一致表示候選尚未更新 */
  resultQuery: string;
  isLoading: boolean;
  onSelect: (route: JsyBusRoute) => void;
  /** 觸控裝置：input 設 inputmode="none" 不叫系統鍵盤，按「其他」才叫出 */
  isCoarsePointer: boolean;
}

type PanelProps = Omit<BusRouteSearchDialogProps, "isOpen" | "onOpenChange"> & {
  onClose: () => void;
};

/**
 * 面板內容：顯示列 + 候選（桌機左欄）、專用鍵盤（桌機右欄）。
 * 隨面板開關掛載，系統鍵盤模式與高亮每次開啟都重置。
 */
const BusRouteSearchPanel: FC<PanelProps> = ({
  inputValue,
  onInputChange,
  suggestions,
  resultQuery,
  isLoading,
  onSelect,
  isCoarsePointer,
  onClose,
}) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  // 按「其他」後改用系統 / 實體鍵盤，專用鍵盤收起（桌機面板只剩左欄）
  const [isSystemKeyboard, setIsSystemKeyboard] = useState(false);
  // 鍵盤高亮的候選 index（-1 = 無高亮）
  const [activeIndex, setActiveIndex] = useState(-1);
  // 下次輸入值更新後要放回的游標位置
  const pendingCaret = useRef<number | null>(null);
  // 觸控裝置：專用鍵盤時不叫系統鍵盤，但保留原生游標
  const inputMode = isCoarsePointer
    ? isSystemKeyboard
      ? "text"
      : "none"
    : undefined;

  // 候選仍是上一個查詢的結果（防抖 / 請求中）
  const isStale = resultQuery !== inputValue.trim();

  // 候選更新後 → 若有與輸入完全相符的路線號（如打「1824」對到「1824」）則自動高亮，方便直接 Enter；否則重置。
  // 舊候選不比對，免得先高亮舊清單後段的同名路線、新清單到了再跳回
  useEffect(() => {
    const q = inputValue.trim().toUpperCase();
    const exactIdx =
      q && !isStale
        ? suggestions.findIndex(
            (r) =>
              r.routeName.toUpperCase() === q ||
              r.routeNameEn?.toUpperCase() === q,
          )
        : -1;
    setActiveIndex(exactIdx);
  }, [suggestions, inputValue, isStale]);

  const handleInput = (v: string) => {
    onInputChange(v);
    setActiveIndex(-1);
  };

  // 受控 input 改值後游標會跳到尾端 → 放回編輯位置
  useLayoutEffect(() => {
    const el = inputRef.current;
    const caret = pendingCaret.current;
    pendingCaret.current = null;
    if (el && caret !== null && document.activeElement === el) {
      el.setSelectionRange(caret, caret);
    }
  }, [inputValue]);

  /** 目前選取範圍；input 未聚焦時視為尾端 */
  const getSelection = (): [number, number] => {
    const el = inputRef.current;
    const len = inputValue.length;
    if (!el || document.activeElement !== el) return [len, len];
    return [el.selectionStart ?? len, el.selectionEnd ?? len];
  };

  /** 以 text 取代 [start, end)，游標移到其後 */
  const replaceRange = (start: number, end: number, text: string) => {
    const next = inputValue.slice(0, start) + text + inputValue.slice(end);
    if (next.length > BUS_ROUTE_QUERY_MAX_LEN) return;
    pendingCaret.current = start + text.length;
    handleInput(next);
  };

  // 鍵帽插入游標處（有選取則取代）
  const insertText = (text: string) => {
    const [start, end] = getSelection();
    replaceRange(start, end, text);
  };

  // 退格：有選取刪選取，否則刪游標前一字
  const backspace = () => {
    const [start, end] = getSelection();
    if (start !== end) replaceRange(start, end, "");
    else if (start > 0) replaceRange(start - 1, start, "");
  };

  // 切換鍵盤只改已聚焦 input 的 inputmode（iOS 隨即叫出 / 收起系統鍵盤），在手勢內同步改 DOM 再更新 state。
  // 不可讓 input 失焦再 focus：同一手勢內 iOS 不會切換鍵盤
  const switchToSystemKeyboard = () => {
    const el = inputRef.current;
    if (!el) return;
    if (isCoarsePointer) el.inputMode = "text";
    if (document.activeElement !== el) el.focus();
    setIsSystemKeyboard(true);
  };

  const switchToKeypad = () => {
    const el = inputRef.current;
    if (!el) return;
    if (isCoarsePointer) el.inputMode = "none";
    if (document.activeElement !== el) el.focus();
    setIsSystemKeyboard(false);
  };

  // 上下鍵移動高亮、Enter 選定（無高亮則選排序最前者，候選未更新時不選）；Esc 由 Modal 關閉
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (isStale) return;
      const pick = activeIndex >= 0 ? suggestions[activeIndex] : suggestions[0];
      if (pick) onSelect(pick);
    }
  };

  const hasQuery = inputValue.trim() !== "";

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 md:flex-row md:gap-5">
      <div className="flex min-h-0 flex-1 flex-col gap-2 md:w-96 md:flex-none">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={suggestions.length > 0}
              aria-controls={BUS_ROUTE_LISTBOX_ID}
              aria-activedescendant={
                activeIndex >= 0 ? busRouteOptionId(activeIndex) : undefined
              }
              autoFocus
              inputMode={inputMode}
              enterKeyHint="search"
              value={inputValue}
              maxLength={BUS_ROUTE_QUERY_MAX_LEN}
              onChange={(e) => handleInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="common-input !rounded-large !py-1 focus:!ring-0"
              placeholder={t("busRouteSearchPlaceholder")}
            />
          </div>
          {isSystemKeyboard && (
            <Button
              isIconOnly
              size="sm"
              aria-label={t("busKeypadBackToKeypad")}
              // 同歷史查詢 / 選站按鈕配色
              className="bg-secondary text-secondary-foreground"
              preventFocusOnPress
              onPress={switchToKeypad}
            >
              <KeyboardIcon className="size-5" />
            </Button>
          )}
          {/* 手機無標題列，關閉為顯示列右側的「取消」文字鈕 */}
          <Button
            size="sm"
            variant="light"
            color="primary"
            onPress={onClose}
            className="min-w-0 shrink-0 px-2 text-base md:hidden"
          >
            {t("cancel")}
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto rounded-large border border-input p-1">
          <BusRouteSuggestionList
            suggestions={suggestions}
            isLoading={isLoading}
            hasQuery={hasQuery}
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
            onSelect={onSelect}
            emptyContent={t("busKeypadEmptyHint")}
          />
        </div>
      </div>

      {!isSystemKeyboard && (
        <div className="shrink-0 md:w-80">
          <BusRouteKeypad
            onInput={insertText}
            onClear={() => handleInput("")}
            onBackspace={backspace}
            onUseSystemKeyboard={switchToSystemKeyboard}
          />
        </div>
      )}
    </div>
  );
};

/**
 * [公車] 路線搜尋面板：手機底部彈出（90% 高）、桌機置中（左欄顯示列 + 候選、右欄鍵盤）。
 */
const BusRouteSearchDialog: FC<BusRouteSearchDialogProps> = ({
  isOpen,
  onOpenChange,
  ...panelProps
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      // 手機底部彈出 90% 高（固定高度，候選多寡不推動鍵盤）；桌機置中固定高度、寬度隨內容（收起鍵盤只剩左欄）
      classNames={{
        base: "m-0 h-bus-search-sheet max-h-bus-search-sheet w-full max-w-full rounded-b-none bg-background pb-safe-bottom sm:m-0 md:mx-6 md:my-16 md:h-bus-search-panel md:w-auto md:max-w-3xl md:rounded-b-large md:pb-0",
        // 手機不顯示標題列與 ×（關閉在顯示列）
        header: "hidden md:flex",
        closeButton: "hidden md:flex",
        body: "min-h-0 flex-1 px-4 pb-2 pt-2 md:px-6 md:pb-6 md:pt-0",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{t("busRouteSearchLabel")}</ModalHeader>
            <ModalBody>
              <BusRouteSearchPanel {...panelProps} onClose={onClose} />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default BusRouteSearchDialog;
