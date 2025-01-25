import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { FC } from "react";
import Search from "../search";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

const ThsrSearch: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{`${t("thsrTitle")} - ${t("trTitle")}`}</title>
      </Head>
      <Search />
    </>
  );
};

export default ThsrSearch;
