import { PageEnum } from "@/enums/PageEnum";

export const baseUrl = "https://traintime.jsy.tw";

export const defaultSeoConfig = {
  ogImage:
    "https://jsying1994.s3.amazonaws.com/traintime/logo/og-new-train-time-v2.png",
};

export interface SeoConfig {
  title: (t: Function) => string;
  description: (t: Function) => string;
  ogTitle: (t: Function) => string;
  ogDescription: (t: Function) => string;
  ogImage?: string;
}

export const seoConfigs: Record<PageEnum, SeoConfig> = {
  [PageEnum.TR]: {
    title: (t) => `${t("trTitle")}`,
    description: (t) => t("webDescription"),
    ogTitle: (t) => t("trTitle"),
    ogDescription: (t) => t("subTitle"),
    ogImage: defaultSeoConfig.ogImage,
  },
  [PageEnum.THSR]: {
    title: (t) => `${t("thsrTitle")}`,
    description: (t) => t("thsrPageDescription"),
    ogTitle: (t) => t("thsrTitle"),
    ogDescription: (t) => t("subTitle"),
    ogImage: defaultSeoConfig.ogImage,
  },
  [PageEnum.TYMC]: {
    title: (t) => `${t("tymcTitle")}`,
    description: (t) => t("tymcPageDescription"),
    ogTitle: (t) => t("tymcTitle"),
    ogDescription: (t) => t("subTitle"),
    ogImage: defaultSeoConfig.ogImage,
  },
  [PageEnum.FEATURES]: {
    title: (t) => `${t("featureIntroductionMenu")} - ${t("trTitle")}`,
    description: (t) => t("featuresPageDescription"),
    ogTitle: (t) => `${t("featureIntroductionMenu")} - ${t("trTitle")}`,
    ogDescription: (t) => t("featuresPageDescription"),
    ogImage: defaultSeoConfig.ogImage,
  },
  [PageEnum.UPDATES]: {
    title: (t) => `${t("updateAnnouncementsMenu")} - ${t("trTitle")}`,
    description: (t) => t("updatesPageDescription"),
    ogTitle: (t) => `${t("updateAnnouncementsMenu")} - ${t("trTitle")}`,
    ogDescription: (t) => t("updatesPageDescription"),
    ogImage: defaultSeoConfig.ogImage,
  },
};
