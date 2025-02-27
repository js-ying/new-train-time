import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { FC } from "react";
import { localeUrlList } from "../../enums/LocaleEnum";
import Home from "../index";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

const ThsrHome: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{`${t("thsr")} - ${t("trTitle")}`}</title>
        <meta name="description" content={t("thsrPageDescription")} />
        <meta
          name="keywords"
          content="THSR, Taiwan High Speed Rail, train schedule"
        />
        <meta property="og:title" content={`${t("thsr")} - ${t("trTitle")}`} />
        <meta
          property="og:site_name"
          content={`${t("thsr")} - ${t("trTitle")}`}
        />
        {localeUrlList.map((loc) => (
          <link
            key={loc.locale}
            rel="alternate"
            hrefLang={loc.locale}
            href={`${loc.url}/THSR`}
          />
        ))}
      </Head>
      <h1 className="hidden">{t("thsrTitle")}</h1>
      <Home />
    </>
  );
};

export default ThsrHome;
