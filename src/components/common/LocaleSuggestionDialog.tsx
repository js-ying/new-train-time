import { LocaleEnum } from "@/enums/LocaleEnum";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

/**
 * 對話框文案：以「目標語系」為主體呈現，使對方一定看得懂。
 *
 * 例外說明（為何不走 i18n common.json）：
 * 這個 Dialog 的文字 **必須以目標語系顯示**，跟當前頁面的 locale 無關。
 * next-i18next 在 SSG 下只 bundle 當前 locale 的翻譯，動態載入目標語系需要 fetch JSON、
 * 或讓每個頁面都同時 bundle 兩個 locale（浪費 HTML 體積），都不划算。
 * 因 Dialog 僅一段文字、支援語系固定為兩種（LocaleEnum），直接用常數表最簡潔。
 */
const DIALOG_COPY: Record<
  LocaleEnum,
  { title: string; message: string; confirmBtn: string; cancelBtn: string }
> = {
  [LocaleEnum.EN]: {
    title: "Language Preference",
    message:
      "This site is also available in English. Would you like to switch?",
    confirmBtn: "Switch to English",
    cancelBtn: "Not now",
  },
  [LocaleEnum.TW]: {
    title: "語系偏好",
    message: "本網站亦提供繁體中文版本，是否切換？",
    confirmBtn: "切換至繁體中文",
    cancelBtn: "暫不切換",
  },
};

/**
 * 根據瀏覽器語言清單挑出最適合的支援 locale。
 * 先做精準比對（zh-TW → zh-TW），再退回前綴比對（en-US → en、zh-HK → zh-TW）。
 * 若仍無命中且使用者首選語系並非中文，退回英文保底，避免非中文使用者卡在預設的繁中頁面。
 */
const getPreferredLocale = (
  browserLangs: readonly string[],
  supported: readonly LocaleEnum[],
): LocaleEnum | null => {
  for (const lang of browserLangs) {
    const exact = supported.find((s) => s === lang);
    if (exact) return exact;
    const prefix = lang.split("-")[0];
    const match = supported.find((s) => s.split("-")[0] === prefix);
    if (match) return match;
  }
  const firstPrefix = browserLangs[0]?.split("-")[0];
  if (firstPrefix && firstPrefix !== "zh") return LocaleEnum.EN;
  return null;
};

/**
 * 語系建議對話框：
 * - 首次造訪時，若瀏覽器偏好語系與當前頁面 locale 不符，主動提示切換
 * - 使用者手動切過語系（寫入 manualLocale）或曾關閉提示（localeSuggestionDismissed）後，不再出現
 * - 採用 CommonDialog 的同一套 HeroUI Modal 樣式，維持風格一致
 */
const LocaleSuggestionDialog: FC = () => {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [targetLocale, setTargetLocale] = useState<LocaleEnum | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      if (window.localStorage.getItem("manualLocale")) return;
      if (window.localStorage.getItem("localeSuggestionDismissed")) return;
    } catch {
      return;
    }

    const supported: LocaleEnum[] = [LocaleEnum.TW, LocaleEnum.EN];
    const browserLangs = Array.from(
      navigator.languages || [navigator.language || ""],
    );
    const preferred = getPreferredLocale(browserLangs, supported);

    if (!preferred || preferred === i18n.language) return;

    setTargetLocale(preferred);
    setOpen(true);
  }, [i18n.language]);

  /** 使用者同意切換：寫入 manualLocale 並導向目標 locale */
  const handleSwitch = () => {
    if (!targetLocale) return;
    try {
      window.localStorage.setItem("manualLocale", targetLocale);
    } catch {}
    setOpen(false);
    router.replace(
      { pathname: router.pathname, query: router.query },
      router.asPath,
      { locale: targetLocale },
    );
  };

  /** 使用者拒絕或關閉：寫入 dismissed flag，後續不再提示 */
  const handleDismiss = () => {
    try {
      window.localStorage.setItem("localeSuggestionDismissed", "true");
    } catch {}
    setOpen(false);
  };

  if (!targetLocale) return null;
  const copy = DIALOG_COPY[targetLocale];

  return (
    <Modal
      isOpen={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleDismiss();
      }}
      size="sm"
      classNames={{
        base: "bg-white dark:bg-eerieBlack-500",
        header: "flex items-center justify-center gap-2",
        body: "text-center",
      }}
      isDismissable={true}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>{copy.title}</ModalHeader>
            <ModalBody className="whitespace-pre-line">{copy.message}</ModalBody>
            <ModalFooter>
              <div className="flex w-full items-center justify-end gap-2">
                <Button
                  variant="light"
                  onPress={handleDismiss}
                  className="min-w-fit"
                >
                  {copy.cancelBtn}
                </Button>
                <Button
                  color="primary"
                  onPress={handleSwitch}
                  className="min-w-fit"
                >
                  {copy.confirmBtn}
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default LocaleSuggestionDialog;
