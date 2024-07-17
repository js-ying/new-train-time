import { useTranslation } from "next-i18next";
import { LocaleEnum } from "../enums/LocaleEnum";

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
