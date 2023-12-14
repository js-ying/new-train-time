import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { PageEnum } from "../../enums/Page";
import Home from "../index";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

const ThsrHome = () => {
  return <Home page={PageEnum.THSR} />;
};

export default ThsrHome;
