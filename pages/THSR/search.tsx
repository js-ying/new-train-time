import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Search from "../search";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

const ThsrSearch = () => {
  return <Search />;
};

export default ThsrSearch;
