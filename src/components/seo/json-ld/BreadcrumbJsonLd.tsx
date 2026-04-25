import { FC } from "react";

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface BreadcrumbJsonLdProps {
  breadcrumbs: BreadcrumbItem[];
}

/**
 * BreadcrumbList JSON-LD：宣告麵包屑導航結構。
 * breadcrumbs 由 useSeo 動態組出（含語系正確的首頁 URL 與當前頁的層級）。
 */
const BreadcrumbJsonLd: FC<BreadcrumbJsonLdProps> = ({ breadcrumbs }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((bc, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: bc.name,
      item: bc.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default BreadcrumbJsonLd;
