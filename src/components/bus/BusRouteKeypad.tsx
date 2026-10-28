import {
  BUS_KEYPAD_COLOR_KEYS,
  BUS_KEYPAD_DIGITS,
  BUS_KEYPAD_LETTER_KEYS,
  BUS_KEYPAD_WORD_GROUPS,
  BusKeypadWordKey,
} from "@/utils/BusKeypadUtils";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, Fragment, ReactNode } from "react";

/** 鍵盤 icon（「其他」鍵：改用系統鍵盤） */
export const KeyboardIcon: FC<{ className: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="2.75" y="6" width="18.5" height="12" rx="2" />
    <path d="M6.5 9.5h.01M10 9.5h.01M13.5 9.5h.01M17 9.5h.01M6.5 12.5h.01M10 12.5h.01M13.5 12.5h.01M17 12.5h.01M8 15h8" />
  </svg>
);

/** 退格 icon */
const BackspaceIcon: FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-6"
    aria-hidden="true"
  >
    <path d="M9 5.5h10.5A1.5 1.5 0 0 1 21 7v10a1.5 1.5 0 0 1-1.5 1.5H9L3 12z" />
    <path d="M11.5 9.5l5 5M16.5 9.5l-5 5" />
  </svg>
);

interface KeyProps {
  onPress: () => void;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}

/** 單顆鍵帽：按下不搶 input 焦點（點鍵後游標仍在 input） */
const Key: FC<KeyProps> = ({
  onPress,
  className = "",
  ariaLabel,
  children,
}) => (
  <Button
    variant="flat"
    radius="md"
    preventFocusOnPress
    aria-label={ariaLabel}
    onPress={onPress}
    className={`h-auto min-w-0 shrink-0 px-0 ${className}`}
  >
    {children}
  </Button>
);

/** 詞彙鍵：色系鍵前加色點；鍵帽是中文資料，標 lang 讓日韓頁沿用繁中字體 */
const WordKey: FC<{
  word: BusKeypadWordKey;
  onInput: (text: string) => void;
  className?: string;
}> = ({ word, onInput, className = "h-8 px-2.5 md:px-2" }) => (
  <Key
    onPress={() => onInput(word.label)}
    className={`gap-1 text-base ${className}`}
  >
    {word.dotClass && (
      <span
        className={`size-2.5 shrink-0 rounded-full ${word.dotClass}`}
        aria-hidden="true"
      />
    )}
    <span lang="zh-Hant">{word.label}</span>
  </Key>
);

interface BusRouteKeypadProps {
  /** 插入文字到游標處 */
  onInput: (text: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  /** 「其他」鍵：改用系統 / 實體鍵盤並收起本鍵盤，位於色系欄底部 */
  onUseSystemKeyboard: () => void;
}

/**
 * [公車] 路線專用鍵盤：上方字母列 + 詞彙列，下方左兩欄色系、右三欄數字。
 */
const BusRouteKeypad: FC<BusRouteKeypadProps> = ({
  onInput,
  onClear,
  onBackspace,
  onUseSystemKeyboard,
}) => {
  const { t } = useTranslation();

  const digitKey = "h-10 text-xl";

  return (
    <div className="flex flex-col gap-1.5">
      {/* 字母單列等寬，不捲動 */}
      <div className="grid grid-cols-10 gap-1">
        {BUS_KEYPAD_LETTER_KEYS.map((word) => (
          <WordKey
            key={word.label}
            word={word}
            onInput={onInput}
            className="h-8"
          />
        ))}
      </div>

      {/* 開頭詞 / 結尾詞：手機同列橫捲，桌機各自折行 */}
      <div className="overflow-x-auto scrollbar-hide md:overflow-visible">
        <div className="flex w-max gap-1 md:w-auto md:flex-col md:gap-1.5">
          {BUS_KEYPAD_WORD_GROUPS.map((group, groupIdx) => (
            <Fragment key={groupIdx}>
              {groupIdx > 0 && (
                <span
                  className="mx-1 w-px shrink-0 self-stretch bg-border md:hidden"
                  aria-hidden="true"
                />
              )}
              <div className="flex shrink-0 gap-1 md:flex-wrap">
                {group.map((word) => (
                  <WordKey key={word.label} word={word} onInput={onInput} />
                ))}
              </div>
            </Fragment>
          ))}
        </div>
      </div>

      {/* 左兩欄色系（第四列為「其他」），右三欄數字；逐列渲染 */}
      <div className="grid grid-cols-bus-keypad gap-1.5">
        {[0, 1, 2].map((row) => (
          <Fragment key={row}>
            {BUS_KEYPAD_COLOR_KEYS.slice(row * 2, row * 2 + 2).map((word) => (
              <WordKey
                key={word.label}
                word={word}
                onInput={onInput}
                className="h-10"
              />
            ))}
            {BUS_KEYPAD_DIGITS.slice(row * 3, row * 3 + 3).map((d) => (
              <Key key={d} onPress={() => onInput(d)} className={digitKey}>
                {d}
              </Key>
            ))}
          </Fragment>
        ))}
        {/* 第四列：其他、清除、0、⌫ */}
        <Key
          onPress={onUseSystemKeyboard}
          ariaLabel={t("busKeypadSystemKeyboardAria")}
          className="col-span-2 h-10 gap-1 text-sm"
        >
          <KeyboardIcon className="size-5" />
          {t("busKeypadSystemKeyboard")}
        </Key>
        <Key onPress={onClear} className="h-10 text-base">
          {t("busKeypadClear")}
        </Key>
        <Key onPress={() => onInput("0")} className={digitKey}>
          0
        </Key>
        <Key
          onPress={onBackspace}
          ariaLabel={t("busKeypadBackspace")}
          className="h-10"
        >
          <BackspaceIcon />
        </Key>
      </div>
    </div>
  );
};

export default BusRouteKeypad;
