import { seoConfigs } from "@/configs/seoConfig";
import { siteLinkPages } from "@/configs/siteLinkConfigs";
import useLang from "@/hooks/useLangHook";
import { useTranslation } from "next-i18next";
import React from "react";

const SiteLinkSection: React.FC = () => {
  const { isTw } = useLang();
  const { t } = useTranslation();

  return (
    <section className="sr-only" aria-hidden="false">
      <h2>{isTw ? "網站導覽" : "Site Navigation"}</h2>
      <ul>
        {siteLinkPages.map((page) => {
          const config = seoConfigs[page];
          return (
            <li key={page}>
              <a href={`${config.localeUrl}`}>{config.title(t)}</a>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default SiteLinkSection;
