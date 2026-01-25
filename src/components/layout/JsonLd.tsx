import { baseUrl } from "@/configs/seoConfig";
import Head from "next/head";
import { FC } from "react";

interface JsonLdProps {
  trTitle: string;
  webDescription: string;
  breadcrumbs: { name: string; item: string }[];
  /** 當前語言代碼，如 "zh-TW" 或 "en" */
  currentLocale: string;
  /** 預設語言代碼 */
  defaultLocale: string;
}

/**
 * JSON-LD 結構化資料元件，用於提升 SEO 和搜尋結果展示。
 */
const JsonLd: FC<JsonLdProps> = ({
  trTitle,
  webDescription,
  breadcrumbs,
  currentLocale,
  defaultLocale,
}) => {
  // 根據語言取得對應的首頁 URL
  const homeUrl =
    currentLocale === defaultLocale ? baseUrl : `${baseUrl}/${currentLocale}`;

  // 取得 ISO 語言代碼格式（用於 inLanguage）
  const inLanguage = currentLocale === "zh-TW" ? "zh-Hant-TW" : currentLocale;

  // 1. WebSite Schema - 網站搜尋與名稱定義
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: trTitle,
    alternateName: [
      "台鐵時刻表",
      "高鐵時刻表",
      "機捷時刻表",
      "TRA Timetable",
      "THSR Timetable",
      "Airport MRT Timetable",
    ],
    url: homeUrl,
    description: webDescription,
    inLanguage: inLanguage,
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${homeUrl}/search?s={search_term_string}&e=`,
        },
        "query-input": "required name=search_term_string",
      },
    ],
  };

  // 2. Breadcrumb Schema - 麵包屑導航結構
  // 修正第一層 URL 根據語言動態調整
  const adjustedBreadcrumbs = breadcrumbs.map((bc, index) => {
    // 第一層固定為首頁，根據語言調整 URL
    if (index === 0) {
      return { ...bc, item: homeUrl };
    }
    return bc;
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: adjustedBreadcrumbs.map((bc, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: bc.name,
      item: bc.item,
    })),
  };

  // 3. Organization Schema - 品牌/組織資訊
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "JSY",
    url: baseUrl,
    logo: "https://jsying1994.s3.amazonaws.com/traintime/logo/logo.png",
    sameAs: ["https://traintime.jsy.tw"],
  };

  return (
    <Head>
      <script
        id="json-ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        id="json-ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        id="json-ld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </Head>
  );
};

export default JsonLd;

