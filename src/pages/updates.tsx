import Layout from "@/components/layout/Layout";
import { GaEnum } from "@/enums/GaEnum";
import useLang from "@/hooks/useLang";
import useMuiTheme from "@/hooks/useMuiTheme";
import { gaClickEvent } from "@/utils/GaUtils";
import { Accordion, AccordionItem, Chip, Tab, Tabs } from "@heroui/react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  oldThsrUpdateDataList,
  oldTrUpdateDataList,
  updateDataList,
} from "public/data/updatesData";
import { FC, useMemo, useRef } from "react";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

/**
 * 舊系統公告列表元件
 * 將舊版的版本更新記錄整理至折疊面板中供使用者查閱
 */
const OldUpdateList: FC = () => {
  const accordionRef = useRef<HTMLDivElement>(null);
  const oldTrDatalist = useMemo(() => {
    return oldTrUpdateDataList;
  }, []);

  const oldThsrDataList = useMemo(() => {
    return oldThsrUpdateDataList;
  }, []);

  return (
    <div
      className="flex scroll-mt-20 flex-col justify-center"
      ref={accordionRef}
    >
      <div className="relative flex items-center py-6">
        <div className="flex-grow border-t border-zinc-300 dark:border-zinc-700"></div>
        <span className="mx-4 flex-shrink text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-400">
          ARCHIVE
        </span>
        <div className="flex-grow border-t border-zinc-300 dark:border-zinc-700"></div>
      </div>

      <Accordion
        onSelectionChange={(keys) => {
          // 當展開時觸發 GA 事件並捲動至該區塊
          if (keys !== "all" && keys.size > 0) {
            gaClickEvent(GaEnum.OLD_SYSTEM_ANNOUNCEMENT);

            // 延遲執行以確保 Accordion 展開動畫開始後再抓取位置
            setTimeout(() => {
              accordionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }, 100);
          }
        }}
        selectionMode="multiple"
        className="px-0"
        itemClasses={{
          title: "text-zinc-700 dark:text-zinc-200 text-base font-semibold",
          subtitle: "text-zinc-500 dark:text-zinc-400 text-sm",
          trigger:
            "py-3 px-4 hover:bg-zinc-200/80 dark:hover:bg-zinc-700 transition-all rounded-xl",
        }}
      >
        <AccordionItem
          key="old-system-announcements"
          aria-label="舊系統公告"
          title="舊系統公告"
          subtitle="收錄舊版系統的更新歷程"
        >
          <div className="mt-4">
            <Tabs
              variant="underlined"
              className="mb-2 flex justify-center font-bold"
              size="lg"
            >
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
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

interface UpdateListProps {
  dataList: {
    date: string;
    type: string;
    ver: string;
    items: { type: string; content: string }[] | string[];
  }[];
}

/**
 * 更新記錄類型與顯示樣式的映射表
 */
const chipColorMap = {
  new: {
    color: "bg-rose-500 text-white dark:bg-rose-500/80",
    desc: "新增",
  },
  fix: {
    color: "bg-sky-500 text-white dark:bg-sky-500/80",
    desc: "修正",
  },
  refactor: {
    color: "bg-indigo-500 text-white dark:bg-indigo-500/80",
    desc: "重構",
  },
  update: {
    color: "bg-teal-500 text-white dark:bg-teal-500/80",
    desc: "更新",
  },
} as const;

/**
 * 更新清單列表元件
 * 負責渲染特定版本資料的卡片樣式
 */
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
            <div className="flex list-inside list-decimal flex-col gap-1.5 whitespace-pre-line">
              {data.items.map((item) => {
                return (
                  <div
                    key={item.content || item}
                    className="flex items-center gap-2"
                  >
                    {item.type && (
                      <Chip className={chipColorMap[item.type].color} size="sm">
                        {chipColorMap[item.type].desc}
                      </Chip>
                    )}
                    {item.content || item}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};

/**
 * 版本更新頁面元件
 * 顯示最新的版本更新記錄，並整合舊系統公告的折疊面板
 */
const Updates: FC = () => {
  const muiTheme = useMuiTheme();
  const { t } = useTranslation();
  const { isTw } = useLang();

  const dataList = useMemo(() => {
    return updateDataList;
  }, []);

  return (
    <>
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
