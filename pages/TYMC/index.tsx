import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { FC } from "react";
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
      </Head>
      <Home />
    </>
  );
};

export default TymcHome;
