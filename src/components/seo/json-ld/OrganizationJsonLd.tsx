import { baseUrl } from "@/configs/seoConfig";
import { FC } from "react";

/**
 * Organization JSON-LD：宣告品牌組織資訊（首頁專用）。
 *
 * 注意：schema.org 規範中 `sameAs` 應指向**不同網域**的官方社群帳號或 Wikipedia 條目，
 * 指回自己網域沒有實質意義。本服務目前無對外社群帳號，因此略去 `sameAs`，未來若新增
 * GitHub repo / 粉專等再補上。
 */
const OrganizationJsonLd: FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "JSY",
    url: baseUrl,
    logo: "https://jsying1994.s3.amazonaws.com/traintime/logo/logo.png",
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default OrganizationJsonLd;
