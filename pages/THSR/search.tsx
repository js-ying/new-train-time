import PageHead from "@/components/layout/PageHead";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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
  return (
    <>
      <PageHead />
      <Search />
    </>
  );
};

export default ThsrSearch;
