import { LocaleEnum } from "@/enums/LocaleEnum";
import { useTranslation } from "next-i18next";

interface UseLangResult {
  isTw: boolean;
  isEn: boolean;
}

const useLang = (): UseLangResult => {
  const { i18n } = useTranslation();
  const isTw = i18n.language === LocaleEnum.TW;
  const isEn = i18n.language === LocaleEnum.EN;

  return {
    isTw,
    isEn,
  };
};

export default useLang;
