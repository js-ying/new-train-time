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
  oldThsrUpdateDataList,
  oldTrUpdateDataList,
  updateDataList,
} from "../public/data/updatesData";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

interface ShowOldUpdateListButtonsProps {
  selected: PageEnum;
  setSelected: (selected: PageEnum) => void;
}

const ShowOldUpdateListButtons: FC<ShowOldUpdateListButtonsProps> = ({
  selected,
  setSelected,
}) => {
  return (
    <div className="flex justify-center gap-6 md:gap-10">
      <Button
        className="bg-neutral-500 text-white dark:bg-neutral-600"
        onClick={() =>
          selected === PageEnum.TR
            ? setSelected(null)
            : setSelected(PageEnum.TR)
        }
      >
        台鐵(舊)
      </Button>
      <Button
        className="bg-neutral-500 text-white dark:bg-neutral-600"
        onClick={() =>
          selected === PageEnum.THSR
            ? setSelected(null)
            : setSelected(PageEnum.THSR)
        }
      >
        高鐵(舊)
      </Button>
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
            key={data.date}
          >
            <div className="mb-2 flex justify-between">
              <div className="font-bold text-silverLakeBlue-500 dark:text-gamboge-500">{`Ver. ${data.ver} 版本更新`}</div>
              <div className="font-bold text-silverLakeBlue-500 dark:text-gamboge-500">{`${data.date}`}</div>
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

  const dataList = useMemo(() => {
    return updateDataList;
  }, []);

  const oldTrDatalist = useMemo(() => {
    return oldTrUpdateDataList;
  }, []);

  const oldThsrDataList = useMemo(() => {
    return oldThsrUpdateDataList;
  }, []);

  return (
    <>
      <Head>
        <title>{`${t("UpdateAnnouncementsMenu")} - ${t("trTitle")}`}</title>
      </Head>

      <MuiThemeProvider theme={muiTheme}>
        <Layout>
          <div className="mx-auto max-w-3xl">
            <div className="mt-8 flex flex-col gap-6">
              <UpdateList dataList={dataList} />

              <ShowOldUpdateListButtons
                selected={selected}
                setSelected={setSelected}
              />

              {selected === PageEnum.TR && (
                <UpdateList dataList={oldTrDatalist} />
              )}
              {selected === PageEnum.THSR && (
                <UpdateList dataList={oldThsrDataList} />
              )}
            </div>
          </div>
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default Updates;
