import IOSSwitchSetting from "@/components/common/IOSSwitchSetting";
import NewLabel from "@/components/common/NewLabel";
import UserDialog from "@/components/common/UserDialog";
import Layout from "@/components/layout/Layout";
import PageSeo from "@/components/seo/PageSeo";
import { useAuth } from "@/contexts/AuthContext";
import { GaEnum } from "@/enums/GaEnum";
import { LocaleEnum } from "@/enums/LocaleEnum";
import useMuiTheme from "@/hooks/useMuiTheme";
import useSetting from "@/hooks/useSetting";
import { gaClickEvent } from "@/utils/GaUtils";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
    revalidate: 86400,
  };
}

/**
 * 設定區塊標題元件
 */
const SectionTitle: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-400">
    {children}
  </div>
);

/**
 * 設定區塊容器元件
 */
const SectionCard: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-xl border border-solid border-zinc-700 bg-white p-4 dark:border-zinc-200 dark:bg-eerieBlack-500">
    {children}
  </div>
);

/**
 * 語系 Segmented Control 元件
 */
const LocaleSegmentedControl: FC = () => {
  const { i18n } = useTranslation();
  const router = useRouter();

  const locales = [
    { label: "繁中", value: LocaleEnum.TW },
    { label: "EN", value: LocaleEnum.EN },
  ];

  /** 切換語系 */
  const handleLocaleChange = (locale: string) => {
    if (locale === i18n.language) return;

    gaClickEvent(locale === LocaleEnum.EN ? GaEnum.EN_LANG : GaEnum.CH_LANG);

    router.replace(
      { pathname: router.pathname, query: router.query },
      undefined,
      { locale },
    );
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm">
        {i18n.language === LocaleEnum.TW ? "語系" : "Language"}
      </span>
      <div className="flex overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-600">
        {locales.map((locale) => (
          <button
            key={locale.value}
            onClick={() => handleLocaleChange(locale.value)}
            className={`px-4 py-1 text-sm font-medium transition-colors
              ${
                i18n.language === locale.value
                  ? "bg-silverLakeBlue-500 text-white dark:bg-gamboge-500 dark:text-eerieBlack-500"
                  : "bg-white text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
          >
            {locale.label}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * 暗色模式 Switch 元件
 */
const DarkModeSwitch: FC = () => {
  const { t } = useTranslation();
  const [theme, setTheme] = useSetting("theme");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  /** 切換亮暗色模式 */
  const handleToggle = (isDark: boolean) => {
    const mode = isDark ? "dark" : "light";
    setTheme(mode);
    gaClickEvent(isDark ? GaEnum.DARK_MODE : GaEnum.LIGHT_MODE);
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm">{t("darkMode")}</span>
      <IOSSwitchSetting
        value={theme === "dark"}
        setValue={handleToggle}
        label=""
        gaEnum={GaEnum.DARK_MODE}
        color="primary"
      />
    </div>
  );
};

/**
 * 系統設定頁面
 */
const Settings: FC = () => {
  const { t } = useTranslation();
  const muiTheme = useMuiTheme();
  /** 取得目前登入狀態，用以決定是否顯示「登入即可同步」banner */
  const { user } = useAuth();
  /** 控制登入 Dialog 開關 */
  const [userDialogOpen, setUserDialogOpen] = useState(false);

  const [showTrTrainNote, setShowTrTrainNote] = useSetting("showTrTrainNote");
  const [showThsrTrainNote, setShowThsrTrainNote] =
    useSetting("showThsrTrainNote");
  const [autoRedirectLastUsedPage, setAutoRedirectLastUsedPage] = useSetting(
    "autoRedirectLastUsedPage",
  );
  const [mobileUseTrDirectBooking, setMobileUseTrDirectBooking] = useSetting(
    "mobileUseTrDirectBooking",
  );
  const [mobileUseThsrDirectBooking, setMobileUseThsrDirectBooking] =
    useSetting("mobileUseThsrDirectBooking");
  /** 控制首頁熱門路線快查區塊的顯示 */
  const [showPopularRoutes, setShowPopularRoutes] =
    useSetting("showPopularRoutes");

  return (
    <>
      <PageSeo />
      <MuiThemeProvider theme={muiTheme}>
        <Layout>
          <div className="mx-auto w-full max-w-3xl">
            <div className="flex flex-col gap-6">
              {/* 未登入時顯示登入引導 banner：強調登入即可跨裝置同步以下設定 */}
              {!user && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/40 bg-primary/5 p-4">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="text-sm font-semibold text-primary">
                      {t("loginSyncBannerTitle")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("loginSyncBannerDescription")}
                    </p>
                  </div>
                  <button
                    onClick={() => setUserDialogOpen(true)}
                    className="shrink-0 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    {t("login")}
                  </button>
                </div>
              )}

              {/* 1️⃣ 顯示設定（放在最前面） */}
              <SectionCard>
                <SectionTitle>{t("displaySetting")}</SectionTitle>
                <div className="flex flex-col gap-4 text-sm">
                  <DarkModeSwitch />
                  <LocaleSegmentedControl />
                </div>
              </SectionCard>

              {/* 2️⃣ 台鐵設定 */}
              <SectionCard>
                <SectionTitle>{t("trSetting")}</SectionTitle>
                <div className="flex flex-col gap-3 text-sm">
                  <IOSSwitchSetting
                    value={showTrTrainNote}
                    setValue={setShowTrTrainNote}
                    label={t("showTrTrainNoteSwitch")}
                    gaEnum={GaEnum.SHOW_TR_TRAIN_NOTE}
                    color="primary"
                  />
                  <IOSSwitchSetting
                    value={mobileUseTrDirectBooking}
                    setValue={setMobileUseTrDirectBooking}
                    label={t("mobileUseTrDirectBookingSwitch")}
                    gaEnum={GaEnum.MOBILE_USE_TR_DIRECT_BOOKING}
                    color="primary"
                    isOnlyMobile={true}
                  />
                </div>
              </SectionCard>

              {/* 3️⃣ 高鐵設定 */}
              <SectionCard>
                <SectionTitle>{t("thsrSetting")}</SectionTitle>
                <div className="flex flex-col gap-3 text-sm">
                  <IOSSwitchSetting
                    value={showThsrTrainNote}
                    setValue={setShowThsrTrainNote}
                    label={t("showThsrTrainNoteSwitch")}
                    gaEnum={GaEnum.SHOW_THSR_TRAIN_NOTE}
                    color="primary"
                  />
                  <IOSSwitchSetting
                    value={mobileUseThsrDirectBooking}
                    setValue={setMobileUseThsrDirectBooking}
                    label={t("mobileUseThsrDirectBookingSwitch")}
                    gaEnum={GaEnum.MOBILE_USE_THSR_DIRECT_BOOKING}
                    color="primary"
                    isOnlyMobile={true}
                  />
                </div>
              </SectionCard>

              {/* 4️⃣ 通用設定 */}
              <SectionCard>
                <SectionTitle>{t("generalSetting")}</SectionTitle>
                <div className="flex flex-col gap-3 text-sm">
                  {/* 控制首頁熱門路線快查區塊的顯示 */}
                  <IOSSwitchSetting
                    value={showPopularRoutes}
                    setValue={setShowPopularRoutes}
                    label={t("showPopularRoutesSwitch")}
                    gaEnum={GaEnum.SHOW_POPULAR_ROUTES}
                    color="primary"
                    suffix={<NewLabel />}
                  />
                  <IOSSwitchSetting
                    value={autoRedirectLastUsedPage}
                    setValue={setAutoRedirectLastUsedPage}
                    label={t("autoRedirectLastUsedPageSwitch")}
                    gaEnum={GaEnum.AUTO_REDIRECT_LAST_USED_PAGE}
                    color="primary"
                  />
                </div>
              </SectionCard>
            </div>
          </div>

          {/* 點擊 banner 登入按鈕後開啟的會員 Dialog */}
          <UserDialog open={userDialogOpen} setOpen={setUserDialogOpen} />
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default Settings;
