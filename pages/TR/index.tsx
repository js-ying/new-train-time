import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Layout from "../../components/Layout";
import SearchArea from "../../components/SearchArea";
import { SearchAreaProvider } from "../../contexts/SearchAreaContext";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

export default function TrHome() {
  const { t } = useTranslation();
  return (
    <SearchAreaProvider>
      <Layout title={t("title")}>
        <SearchArea stationList={[]} />
      </Layout>
    </SearchAreaProvider>
  );
}
