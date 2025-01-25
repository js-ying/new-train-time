import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { Switch, Tab, Tabs } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTheme } from "next-themes";
import Head from "next/head";
import { FC, useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import { GaEnum } from "../enums/GaEnum";
import useLang from "../hooks/useLangHook";
import useMuiTheme from "../hooks/useMuiThemeHook";
import {
  oldThsrUpdateDataList,
  oldTrUpdateDataList,
  updateDataList,
} from "../public/data/updatesData";
import { gaClickEvent } from "../utils/GaUtils";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

const OldUpdateList: FC = () => {
  const [open, setOpen] = useState(false);

  const oldTrDatalist = useMemo(() => {
    return oldTrUpdateDataList;
  }, []);

  const oldThsrDataList = useMemo(() => {
    return oldThsrUpdateDataList;
  }, []);

  return (
    <div className="flex flex-col justify-center">
      <Switch
        onValueChange={(val) => {
          gaClickEvent(GaEnum.OLD_SYSTEM_ANNOUNCEMENT);
          setOpen(val);
        }}
        size="sm"
        color="default"
      >
        舊系統公告
      </Switch>

      {open && (
        <Tabs variant="underlined" className="flex justify-center" size="lg">
          <Tab key="oldTr" title="台鐵">
            <div className="flex flex-col gap-6">
              <UpdateList dataList={oldTrDatalist} />
            </div>
          </Tab>
          <Tab key="oldThsr" title="高鐵">
            <div className="flex flex-col gap-6">
              <UpdateList dataList={oldThsrDataList} />
            </div>
          </Tab>
        </Tabs>
      )}
    </div>
  );
};

interface UpdateListProps {
  dataList: {
    date: string;
    type: string;
    ver: string;
    items: string[];
  }[];
}

const UpdateList: FC<UpdateListProps> = ({ dataList }) => {
  return (
    <>
      {dataList.map((data) => {
        return (
          <div
            className="rounded-md border border-solid border-zinc-700 p-4 dark:border-zinc-200"
            key={data.ver}
          >
            <div className="mb-2 flex justify-between font-bold text-silverLakeBlue-500 dark:text-gamboge-500">
              <div>{`Ver. ${data.ver} 版本更新`}</div>
              <div>{`${data.date}`}</div>
            </div>
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
  const { isTw } = useLang();
  const { theme } = useTheme();

  const dataList = useMemo(() => {
    return updateDataList;
  }, []);

  return (
    <>
      <Head>
        <title>{`${t("UpdateAnnouncementsMenu")} - ${t("trTitle")}`}</title>
        <meta
          name="theme-color"
          content={theme === "light" ? "#FFFFFF" : "#212529"}
        />
      </Head>

      <MuiThemeProvider theme={muiTheme}>
        <Layout>
          <div className="mx-auto max-w-3xl">
            {!isTw && (
              <p className="text-center text-zinc-500 dark:text-zinc-400">
                {t("pageOnlyTwMsg")}
              </p>
            )}
            <div className="mt-8 flex flex-col gap-6">
              <UpdateList dataList={dataList} />

              <OldUpdateList />
            </div>
          </div>
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default Updates;
