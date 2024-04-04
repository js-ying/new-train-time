import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { Button } from "@nextui-org/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { FC, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { PageEnum } from "../enums/PageEnum";
import useMuiTheme from "../hooks/useMuiThemeHook";
import {
  oldThsrUpdatesData,
  oldTrUpdatesData,
  updatesData,
} from "../public/data/updatesData";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

const Introduction: FC = () => {
  return (
    <>
      <p>
        歡迎來到「台鐵時刻查詢」，或是「高鐵時刻查詢」。總之現在兩個鐵都可以一起查了。以前分開來的兩套系統，現在合而為一。
      </p>
      <p>
        由於涉及整個系統的重構，我決定重置更新版號，並只列出新系統的公告。如果對舊系統的更新記錄有興趣，也可以點選下方的按鈕查看。
      </p>
    </>
  );
};

interface ShowOldUpdateListButtonsProps {
  selected: PageEnum;
  setSelected: (selected: PageEnum) => void;
}

const ShowOldUpdateListButtons: FC<ShowOldUpdateListButtonsProps> = ({
  selected,
  setSelected,
}) => {
  return (
    <>
      <div className="flex justify-center">
        <Button
          className="bg-neutral-500 text-white dark:bg-neutral-600"
          onClick={() =>
            selected === PageEnum.TR
              ? setSelected(null)
              : setSelected(PageEnum.TR)
          }
        >
          查看原台鐵時刻查詢更新記錄
        </Button>
      </div>
      <div className="flex justify-center">
        <Button
          className="bg-neutral-500 text-white dark:bg-neutral-600"
          onClick={() =>
            selected === PageEnum.THSR
              ? setSelected(null)
              : setSelected(PageEnum.THSR)
          }
        >
          查看原高鐵時刻查詢更新記錄
        </Button>
      </div>
    </>
  );
};

const UpdateList: FC = () => {
  const dataList = useMemo(() => {
    return updatesData.reverse();
  }, []);

  return (
    <>
      {dataList.map((data) => {
        return (
          <div
            className="rounded-md border border-solid border-zinc-700 p-4 dark:border-zinc-200"
            key={data.ver}
          >
            <div className="mb-2 flex justify-between">
              <div className="font-bold text-silverLakeBlue-500 dark:text-gamboge-500">{`${data.ver} 版本更新`}</div>
              <div className="text-silverLakeBlue-500 dark:text-gamboge-500">{`${data.date}`}</div>
            </div>
            <ol className="list-inside list-decimal whitespace-pre-line text-sm">
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

const TrUpdateList: FC = () => {
  const dataList = useMemo(() => {
    return oldTrUpdatesData;
  }, []);

  return (
    <>
      {dataList.map((data, index) => {
        return (
          <div
            className="rounded-md border border-solid border-zinc-700 p-4 dark:border-zinc-200"
            key={data.date}
          >
            <div className="mb-2 flex justify-between">
              <div className="font-bold text-silverLakeBlue-500 dark:text-gamboge-500">{`Ver. ${
                dataList.length - index
              } 版本更新`}</div>
              <div className="text-silverLakeBlue-500 dark:text-gamboge-500">{`${data.date}`}</div>
            </div>
            <ol className="list-inside list-decimal whitespace-pre-line text-sm">
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

const ThsrUpdateList: FC = () => {
  const dataList = useMemo(() => {
    return oldThsrUpdatesData;
  }, []);

  return (
    <>
      {dataList.map((data, index) => {
        return (
          <div
            className="rounded-md border border-solid border-zinc-700 p-4 dark:border-zinc-200"
            key={data.date}
          >
            <div className="mb-2 flex justify-between">
              <div className="font-bold text-silverLakeBlue-500 dark:text-gamboge-500">{`Ver. ${
                dataList.length - index
              } 版本更新`}</div>
              <div className="text-silverLakeBlue-500 dark:text-gamboge-500">{`${data.date}`}</div>
            </div>
            <ol className="list-inside list-decimal whitespace-pre-line text-sm">
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
  const [selected, setSelected] = useState(null);

  return (
    <>
      <Head>
        <title>{t("UpdateAnnouncementsMenu")}</title>
      </Head>

      <MuiThemeProvider theme={muiTheme}>
        <Layout>
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-col gap-2 pt-4">
              <Introduction />
            </div>
            <div className="mt-6 flex flex-col gap-6">
              <UpdateList />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ShowOldUpdateListButtons
                  selected={selected}
                  setSelected={setSelected}
                />
              </div>
              {selected === PageEnum.TR && <TrUpdateList />}
              {selected === PageEnum.THSR && <ThsrUpdateList />}
            </div>
          </div>
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default Updates;
