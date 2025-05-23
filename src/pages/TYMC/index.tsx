import PageHead from "@/components/PageHead";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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
      <PageHead />
      <h1 className="hidden">{t("tymcTitle")}</h1>
      <Home />
    </>
  );
};

export default TymcHome;
