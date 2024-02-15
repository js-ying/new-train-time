import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Home from "../index";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

const ThsrHome = () => {
  return <Home />;
};

export default ThsrHome;
