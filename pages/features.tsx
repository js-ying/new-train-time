import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { Button, Image } from "@nextui-org/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { FC, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Layout from "../components/Layout";
import useMuiTheme from "../hooks/useMuiThemeHook";

// import optional lightbox plugins
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { featureImgList } from "../public/data/featuresData";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

const WebIntroduction: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="grid grid-cols-3 gap-4 pt-4">
        <Image
          src={`https://jsying1994.s3.amazonaws.com/traintime/logo/logo-lg.png`}
          alt="traintime-logo"
          width={200}
          height={200}
        />
        <div className="col-span-2 grid content-between gap-2">
          <div>
            <div className="text-lg font-bold">{t("trTitle")}</div>
            <div className="text-zinc-500 dark:text-zinc-400">
              {t("webDescription")}
            </div>
          </div>
          <div>
            <Button
              radius="full"
              size="sm"
              className="bg-neutral-500 text-white dark:bg-neutral-600"
            >
              安裝到桌面
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

const FeaturesGallery: FC = () => {
  const viewerList = featureImgList.map((img) => {
    return {
      src: `https://jsying1994.s3.amazonaws.com/traintime/features/${img.imgName}`,
      description: `${img.title}`,
    };
  });

  const [activeIndex, setActiveIndex] = useState(-1);

  return (
    <div className="overflow-x-auto whitespace-nowrap">
      {featureImgList.map((img, index) => (
        <Image
          src={`https://jsying1994.s3.amazonaws.com/traintime/features/${img.imgName}`}
          alt={`${img.title}`}
          key={img.imgName}
          loading="lazy"
          width={248}
          height={534}
          classNames={{
            img: "border cursor-pointer",
            wrapper: `inline-block ${
              index === featureImgList.length - 1 ? "" : "mr-8"
            }`,
          }}
          onClick={() => {
            setActiveIndex(index);
          }}
        />
      ))}

      <Lightbox
        slides={viewerList}
        open={activeIndex >= 0}
        index={activeIndex}
        close={() => setActiveIndex(-1)}
        animation={{ swipe: 350 }}
        // enable optional lightbox plugins
        plugins={[Counter, Thumbnails, Zoom]}
        thumbnails={{ border: 0, gap: 0, padding: 0, width: 80 }}
      />
    </div>
  );
};

const Features: FC = () => {
  const { t } = useTranslation();
  const muiTheme = useMuiTheme();

  return (
    <>
      <Head>
        <title>{t("featureIntroductionMenu")}</title>
      </Head>

      <MuiThemeProvider theme={muiTheme}>
        <Layout>
          <div className="mx-auto max-w-3xl">
            <WebIntroduction />
            <div className="mt-8">
              <FeaturesGallery />
            </div>
          </div>
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default Features;
