import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { FC, useMemo } from "react";
import Layout from "../components/Layout";
import useMuiTheme from "../hooks/useMuiThemeHook";
import { updatesData } from "../public/data/updatesData";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

const UpdateList: FC = () => {
  const dataList = useMemo(() => {
    return updatesData;
  }, []);

  return (
    <>
      {dataList.map((data, index) => {
        return (
          <div className="" key={data.items[0]}>
            <div className="font-bold text-silverLakeBlue-500 dark:text-gamboge-500">{`Ver.${
              dataList.length - index
            }【${
              data.type === "tr"
                ? "台鐵"
                : data.type === "thsr"
                  ? "高鐵"
                  : "雙鐵"
            }】版本 (${data.date})`}</div>
            <ol className="list-inside list-decimal whitespace-pre-line">
              {data.items.map((item) => {
                return <li key={item}>{item}</li>;
              })}
            </ol>
          </div>
        );
      })}
    </>
  );
};

const Updates: FC = () => {
  const muiTheme = useMuiTheme();
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("UpdateAnnouncementsMenu")}</title>
      </Head>

      <MuiThemeProvider theme={muiTheme}>
        <Layout>
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-col gap-6 pt-4">
              <UpdateList />
            </div>
          </div>
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default Updates;
