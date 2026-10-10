import { LocaleEnum } from "@/enums/LocaleEnum";
import { useTranslation } from "next-i18next";

interface UseLangResult {
  /** 繁體中文：有中文內容可看（台鐵備註、條款等只有中文的內容） */
  isZh: boolean;
  isEn: boolean;
  /** 中日韓：名稱短、採 CJK 緊湊版面（實心 badge、窄欄置中、較大字級） */
  isCjkLayout: boolean;
  /** 詞與詞以空格分隔（英文、韓文）：相鄰文字片段之間要留空 */
  isSpaceSeparated: boolean;
}

/** 依目前語系提供版面與內容判斷用的旗標 */
const useLang = (): UseLangResult => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return {
    isZh: lang === LocaleEnum.TW,
    isEn: lang === LocaleEnum.EN,
    isCjkLayout: lang !== LocaleEnum.EN,
    isSpaceSeparated: lang === LocaleEnum.EN || lang === LocaleEnum.KO,
  };
};

export default useLang;
