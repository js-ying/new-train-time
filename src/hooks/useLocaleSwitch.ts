import { GaEnum } from "@/enums/GaEnum";
import { LocaleEnum } from "@/enums/LocaleEnum";
import { gaClickEvent } from "@/utils/GaUtils";
import { ALL_LOCALES } from "@/utils/LocaleUtils";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useCallback } from "react";

const GA_EVENT: Record<LocaleEnum, GaEnum> = {
  [LocaleEnum.TW]: GaEnum.CH_LANG,
  [LocaleEnum.EN]: GaEnum.EN_LANG,
  [LocaleEnum.JA]: GaEnum.JA_LANG,
  [LocaleEnum.KO]: GaEnum.KO_LANG,
};

/** 語系切換：切換時記錄使用者選擇並以新語系重新導向目前頁面 */
const useLocaleSwitch = () => {
  const router = useRouter();
  const { i18n } = useTranslation();

  const switchLocale = useCallback(
    (locale: LocaleEnum) => {
      if (locale === i18n.language) return;

      // 紀錄使用者已顯式選擇語系，避免日後再跳出語系建議彈窗
      try {
        window.localStorage.setItem("manualLocale", locale);
      } catch {}
      gaClickEvent(GA_EVENT[locale]);

      // 同 pathname 用 push 不會觸發 query 改變，故用 replace
      router.replace(
        { pathname: router.pathname, query: router.query },
        undefined,
        { locale },
      );
    },
    [i18n.language, router],
  );

  return {
    locales: ALL_LOCALES,
    currentLocale: i18n.language as LocaleEnum,
    switchLocale,
  };
};

export default useLocaleSwitch;
