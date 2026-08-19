import { baseUrl } from "@/configs/seoConfig";
import { FC } from "react";

/**
 * Organization JSON-LD：宣告品牌組織資訊（首頁專用）。
 * `sameAs` 略去：schema.org 要求指向其他網域的官方帳號，目前無對外社群帳號可填。
 */
const OrganizationJsonLd: FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "JSY",
    url: baseUrl,
    logo: "https://jsying1994.s3.us-east-1.amazonaws.com/traintime/logo/logo.png",
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
