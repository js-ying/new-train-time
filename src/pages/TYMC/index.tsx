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
  return (
    <>
      <Home />
    </>
  );
};

export default TymcHome;
