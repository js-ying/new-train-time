import { JsyPopularRoutes } from "@/models/jsy-popular-routes";
import { getHomeStaticProps } from "@/services/popularRoutesService";
import { FC } from "react";
import Home from "../index";

export async function getStaticProps({ locale }) {
  return getHomeStaticProps(locale);
}

interface ThsrHomeProps {
  /** 由 getStaticProps 注入，轉交 Home → PopularRoutes 供 SSR */
  popularRoutes?: JsyPopularRoutes;
}

const ThsrHome: FC<ThsrHomeProps> = ({ popularRoutes }) => {
  return (
    <>
      <Home popularRoutes={popularRoutes} />
    </>
  );
};

export default ThsrHome;
