import { Image } from "@heroui/react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FC, useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// import optional lightbox plugins
import Layout from "@/components/layout/Layout";
import PWAInstallButton from "@/components/pwa-promot/PWAInstallButton";
import useMuiTheme from "@/hooks/useMuiThemeHook";
import { featureImgList } from "public/data/featuresData";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

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
    <div className="grid grid-cols-3 gap-4 pt-4">
      <div className="max-h-[200px] max-w-[200px]">
        <Image
          src={`https://jsying1994.s3.amazonaws.com/traintime/logo/logo-lg.png`}
          alt="traintime-logo"
          sizes="100vw"
        />
      </div>
      <div className="col-span-2 grid content-between gap-2">
        <div>
          <div className="text-lg font-bold">{t("trTitle")}</div>
          <div className="text-zinc-500 dark:text-zinc-400">
            {t("webDescription")}
          </div>
        </div>
        <div>
          <PWAInstallButton />
        </div>
      </div>
    </div>
  );
};

const FeaturesGallery: FC = () => {
  const slideList = useMemo(
    () =>
      featureImgList.map((img) => {
        return {
          src: `https://jsying1994.s3.amazonaws.com/traintime/features/v2/${img.imgName}`,
        };
      }),
    [],
  );

  const [activeIndex, setActiveIndex] = useState(-1);

  return (
    <div className="overflow-x-auto whitespace-nowrap">
      {featureImgList.map((img, index) => (
        <Image
          src={`https://jsying1994.s3.amazonaws.com/traintime/features/v2/${img.imgName}`}
          alt={`${img.title}`}
          key={img.imgName}
          width={248}
          height={534}
          classNames={{
            img: "border custom-cursor-pointer",
            wrapper: `inline-block ${
              index === featureImgList.length - 1 ? "" : "mr-4 md:mr-8"
            }`,
          }}
          onClick={() => {
            setActiveIndex(index);
          }}
        />
      ))}

      <Lightbox
        slides={slideList}
        open={activeIndex >= 0}
        index={activeIndex}
        close={() => setActiveIndex(-1)}
        animation={{ swipe: 350 }}
        controller={{ closeOnBackdropClick: true }}
        carousel={{ padding: 55 }}
        // enable optional lightbox plugins
        plugins={[Counter, Zoom]}
        counter={{
          style: { fontSize: 12, margin: 0, marginLeft: 10 },
        }}
        styles={{
          icon: { height: 22, width: 22 },
        }}
      />
    </div>
  );
};

const Features: FC = () => {
  const muiTheme = useMuiTheme();

  return (
    <>
      <MuiThemeProvider theme={muiTheme}>
        <Layout>
          <div className="mx-auto max-w-3xl">
            <WebIntroduction />
            <div className="mt-6 md:mt-8">
              <FeaturesGallery />
            </div>
          </div>
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default Features;
