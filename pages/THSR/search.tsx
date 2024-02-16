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
  return <Search />;
};

export default ThsrSearch;
