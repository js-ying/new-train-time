import { baseUrl } from "@/configs/seoConfig";
import { FC } from "react";

interface JsonLdProps {
  trTitle: string;
  webDescription: string;
  breadcrumbs: { name: string; item: string }[];
}

const JsonLd: FC<JsonLdProps> = ({ trTitle, webDescription, breadcrumbs }) => {
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
    url: baseUrl,
    description: webDescription,
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${baseUrl}/search?s={search_term_string}&e=`,
        },
        "query-input": "required name=search_term_string",
      },
    ],
  };

  // 2. Breadcrumb Schema - 麵包屑導航結構
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((bc, index) => ({
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
};

export default JsonLd;
