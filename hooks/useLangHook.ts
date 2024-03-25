import { useTranslation } from "next-i18next";

interface UseLangResult {
  isTw: boolean;
  isEn: boolean;
}

const useLang = (): UseLangResult => {
  const { i18n } = useTranslation();
  const isTw = i18n.language === "zh-Hant";
  const isEn = i18n.language === "en";

  return {
    isTw,
    isEn,
  };
};

export default useLang;
