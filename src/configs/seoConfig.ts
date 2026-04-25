import { PageEnum } from "@/enums/PageEnum";
import type { DefaultSeoProps } from "next-seo";

export const baseUrl = "https://traintime.jsy.tw";

/** 全站固定 OG 圖（NextSeo 未覆寫時的 fallback） */
export const defaultOgImage =
  "https://jsying1994.s3.amazonaws.com/traintime/logo/og-new-train-time-v2.png";

/**
 * next-seo 的 <DefaultSeo> 全域設定。
 *
 * 僅放「全站不變、與 i18n 無關」的欄位（OG 圖、Twitter card、type）。
 * 涉及語系的 title / description / siteName 由 PageSeo 元件透過 NextSeo 動態覆寫。
 */
export const defaultSeoConfig: DefaultSeoProps = {
  openGraph: {
    type: "website",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Traintime",
      },
    ],
  },
  twitter: {
    cardType: "summary_large_image",
  },
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
    ogImage: defaultOgImage,
  },
  [PageEnum.THSR]: {
    title: (t) => `${t("thsrTitle")}`,
    description: (t) => t("thsrPageDescription"),
    ogTitle: (t) => t("thsrTitle"),
    ogDescription: (t) => t("subTitle"),
    ogImage: defaultOgImage,
  },
  [PageEnum.TYMC]: {
    title: (t) => `${t("tymcTitle")}`,
    description: (t) => t("tymcPageDescription"),
    ogTitle: (t) => t("tymcTitle"),
    ogDescription: (t) => t("subTitle"),
    ogImage: defaultOgImage,
  },
  [PageEnum.FEATURES]: {
    title: (t) => `${t("featureIntroductionMenu")} - ${t("trTitle")}`,
    description: (t) => t("featuresPageDescription"),
    ogTitle: (t) => `${t("featureIntroductionMenu")} - ${t("trTitle")}`,
    ogDescription: (t) => t("featuresPageDescription"),
    ogImage: defaultOgImage,
  },
  [PageEnum.UPDATES]: {
    title: (t) => `${t("updateAnnouncementsMenu")} - ${t("trTitle")}`,
    description: (t) => t("updatesPageDescription"),
    ogTitle: (t) => `${t("updateAnnouncementsMenu")} - ${t("trTitle")}`,
    ogDescription: (t) => t("updatesPageDescription"),
    ogImage: defaultOgImage,
  },
  [PageEnum.SETTINGS]: {
    title: (t) => `${t("settingsPageTitle")} - ${t("trTitle")}`,
    description: (t) => t("settingsPageDescription"),
    ogTitle: (t) => `${t("settingsPageTitle")} - ${t("trTitle")}`,
    ogDescription: (t) => t("settingsPageDescription"),
    ogImage: defaultOgImage,
  },
  [PageEnum.PRIVACY]: {
    title: (t) => `${t("privacyPolicy")} - ${t("trTitle")}`,
    description: (t) => t("privacyPageDescription"),
    ogTitle: (t) => `${t("privacyPolicy")} - ${t("trTitle")}`,
    ogDescription: (t) => t("privacyPageDescription"),
    ogImage: defaultOgImage,
  },
  [PageEnum.TERMS]: {
    title: (t) => `${t("termsOfService")} - ${t("trTitle")}`,
    description: (t) => t("termsPageDescription"),
    ogTitle: (t) => `${t("termsOfService")} - ${t("trTitle")}`,
    ogDescription: (t) => t("termsPageDescription"),
    ogImage: defaultOgImage,
  },
};
