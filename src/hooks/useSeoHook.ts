import { seoConfigs } from "@/configs/seoConfig";
import usePage from "./usePageHook";

const useSeo = () => {
  const { page } = usePage();

  return {
    seo: seoConfigs[page],
  };
};

export default useSeo;
