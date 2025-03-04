import { LocaleEnum } from "@/enums/LocaleEnum";
import { PageEnum } from "@/enums/PageEnum";

export const baseUrl = "https://traintime.jsy.tw";

export const defaultSeoConfig = {
  ogImage:
    "https://jsying1994.s3.amazonaws.com/traintime/logo/og-new-train-time-v2.png",
};

export interface SeoConfig {
  title: (t: Function) => string;
  description: (t: Function) => string;
  keywords?: string;
  ogTitle: (t: Function) => string;
  ogDescription: (t: Function) => string;
  ogUrl: string;
  ogImage?: string;
  localeUrl: string;
}

export const seoConfigs: Record<PageEnum, SeoConfig> = {
  [PageEnum.TR]: {
    title: (t) => `${t("trTitle")}${t("colon")}${t("subTitle")}`,
    description: (t) => t("webDescription"),
    ogTitle: (t) => t("trTitle"),
    ogDescription: (t) => t("subTitle"),
    keywords:
      "台鐵時刻表, 台鐵火車, 列車時刻, 即時誤點, 票價查詢, 訂票連結, 火車查詢, 台灣鐵路, 通勤, 旅遊",
    ogUrl: "https://traintime.jsy.tw",
    ogImage: defaultSeoConfig.ogImage,
    localeUrl: "/",
  },
  [PageEnum.THSR]: {
    title: (t) => `${t("thsrTitle")}${t("colon")}${t("subTitle")}`,
    description: (t) => t("thsrPageDescription"),
    ogTitle: (t) => t("thsrTitle"),
    ogDescription: (t) => t("subTitle"),
    keywords:
      "高鐵時刻表, 台灣高鐵, 高鐵班次, 高鐵自由座, 高鐵票價, 高鐵誤點, 高鐵查詢, 列車時刻, 即時高鐵資訊",
    ogUrl: "https://traintime.jsy.tw/THSR",
    localeUrl: "/THSR",
    ogImage: defaultSeoConfig.ogImage,
  },
  [PageEnum.TYMC]: {
    title: (t) => `${t("tymcTitle")}${t("colon")}${t("subTitle")}`,
    description: (t) => t("tymcPageDescription"),
    ogTitle: (t) => t("tymcTitle"),
    ogDescription: (t) => t("subTitle"),
    keywords:
      "桃園機場捷運, 機場捷運時刻表, 捷運時刻表, 桃捷班次, 機場捷運票價, 桃園捷運查詢, MRT 時刻表",
    ogUrl: "https://traintime.jsy.tw/TYMC",
    localeUrl: "/TYMC",
    ogImage: defaultSeoConfig.ogImage,
  },
  [PageEnum.FEATURES]: {
    title: (t) => `${t("featureIntroductionMenu")} - ${t("trTitle")}`,
    description: (t) => t("featuresPageDescription"),
    ogTitle: (t) => `${t("featureIntroductionMenu")} - ${t("trTitle")}`,
    ogDescription: (t) => t("featuresPageDescription"),
    keywords:
      "台鐵時刻表功能介紹, 高鐵時刻表功能介紹, 桃園機場捷運功能介紹, 系統功能說明",
    ogUrl: "https://traintime.jsy.tw/features",
    localeUrl: "/features",
    ogImage: defaultSeoConfig.ogImage,
  },
  [PageEnum.UPDATES]: {
    title: (t) => `${t("updateAnnouncementsMenu")} - ${t("trTitle")}`,
    description: (t) => t("updatesPageDescription"),
    ogTitle: (t) => `${t("updateAnnouncementsMenu")} - ${t("trTitle")}`,
    ogDescription: (t) => t("updatesPageDescription"),
    keywords: "系統更新紀錄, 功能更新, 系統公告, 版本更新",
    ogUrl: "https://traintime.jsy.tw/updates",
    localeUrl: "/updates",
    ogImage: defaultSeoConfig.ogImage,
  },
};

export const localeUrlList = [
  { locale: LocaleEnum.TW, url: baseUrl + "" },
  { locale: LocaleEnum.EN, url: baseUrl + "/en" },
];
