import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { PageEnum } from "../../enums/Page";
import Search from "../search";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

const ThsrSearch = () => {
  return <Search page={PageEnum.THSR} />;
};

export default ThsrSearch;
