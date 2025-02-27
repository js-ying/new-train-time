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

const TymcHome: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{`${t("tymc")} - ${t("trTitle")}`}</title>
        <meta name="description" content={t("tymcPageDescription")} />
        <meta
          name="keywords"
          content="TYMC, TaoYuan Metro, TaoYuan Airport MRT, train schedule"
        />
        <meta property="og:title" content={`${t("tymc")} - ${t("trTitle")}`} />
        <meta
          property="og:site_name"
          content={`${t("tymc")} - ${t("trTitle")}`}
        />
        {localeUrlList.map((loc) => (
          <link
            key={loc.locale}
            rel="alternate"
            hrefLang={loc.locale}
            href={`${loc.url}/TYMC`}
          />
        ))}
      </Head>
      <h1 className="hidden">{t("tymcTitle")}</h1>
      <Home />
    </>
  );
};

export default TymcHome;
