import { PREMIUM_PLANS } from "@/configs/premiumPlans";
import Layout from "@/components/layout/Layout";
import useMuiTheme from "@/hooks/useMuiTheme";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import { FC } from "react";

/** 建置時注入翻譯檔 */
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
    revalidate: 86400,
  };
}

/**
 * 付費方案介紹頁（公開、免登入）
 * - 作為綠界 ECPay 申請所需的「販售網址」：公開展示方案 / 定價 / 權益比較 / 購買須知 + 聯絡 email（可索引）。
 * - 付款流程（Phase 1）尚未上線，購買 CTA 先顯示「即將開放」。
 */
const Premium: FC = () => {
  const muiTheme = useMuiTheme();
  const { t } = useTranslation();

  // 一般會員 vs 付費會員 權益比較（付費＝一般＋免廣告）
  const compareRows = [
    { label: t("syncSettingsBenefit"), basic: true, premium: true },
    { label: t("syncHistoryBenefit"), basic: true, premium: true },
    { label: t("adFreeBenefit"), basic: false, premium: true },
  ];

  return (
    <>
      <NextSeo
        title={`${t("premium.pageTitle")} - ${t("trTitle")}`}
        description={t("premium.seoDescription")}
      />
      <MuiThemeProvider theme={muiTheme}>
        <Layout>
          <article className="mx-auto w-full max-w-3xl space-y-6 text-left leading-relaxed text-zinc-700 [text-align-last:left] dark:text-zinc-200">
            {/* Hero：贊助支持開發 */}
            <header className="space-y-2">
              <h1 className="text-3xl font-bold">{t("premium.heading")}</h1>
              <p className="text-zinc-600 dark:text-zinc-300">
                {t("premium.supportMessage")}
              </p>
            </header>

            {/* 權益比較：一般會員 vs 付費會員 */}
            <section className="space-y-2">
              <h2 className="text-xl font-bold">
                {t("premium.benefitsHeading")}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-700">
                      <th className="py-2 pr-3 text-left font-medium">
                        {t("premium.compareFeature")}
                      </th>
                      <th className="px-3 py-2 font-medium">
                        <span className="flex justify-center">
                          {t("basicMember")}
                        </span>
                      </th>
                      <th className="text-primary px-3 py-2 font-medium">
                        <span className="flex justify-center">
                          {t("premiumMember")}
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareRows.map((row) => (
                      <tr
                        key={row.label}
                        className="border-b border-zinc-100 dark:border-zinc-800"
                      >
                        <td className="py-2 pr-3">{row.label}</td>
                        <td className="px-3 py-2">
                          <span className="flex justify-center text-zinc-400">
                            {row.basic ? "✓" : "—"}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-primary flex justify-center font-medium">
                            {row.premium ? "✓" : "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 方案：越買越划算（每月均價遞減） */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold">{t("premium.plansHeading")}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {t("premium.paymentComingSoon")}
              </p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {PREMIUM_PLANS.map((plan) => {
                  const perMonth = Math.round(plan.priceTwd / plan.months);
                  const isBest = plan.code === "12m";
                  return (
                    <li
                      key={plan.code}
                      className={`relative flex flex-col gap-1 rounded-xl border p-4 ${
                        isBest
                          ? "border-primary"
                          : "border-zinc-200 dark:border-zinc-700"
                      }`}
                    >
                      {isBest && (
                        <span className="text-primary-foreground absolute -top-2 right-3 rounded-full bg-primary px-2 py-0.5 text-xxs font-semibold">
                          {t("premium.planBestValue")}
                        </span>
                      )}
                      <p className="text-base font-semibold">
                        {t(`premium.plan${plan.code}`)}
                      </p>
                      <p className="text-2xl font-bold">
                        {t("premium.planTotal", { price: plan.priceTwd })}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {t("premium.planPerMonth", { price: perMonth })}
                      </p>
                      <button
                        type="button"
                        disabled
                        className="mt-2 w-full cursor-not-allowed rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
                      >
                        {t("premium.buyCta")}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* 購買須知 / 退款政策（消保：一次性、到期不自動續約、排除猶豫期） */}
            <section className="space-y-2">
              <h2 className="text-xl font-bold">{t("premium.termsHeading")}</h2>
              <ul className="list-disc space-y-1 pl-6 text-sm">
                <li>{t("premium.termsOneTime")}</li>
                <li>{t("premium.termsExpiry")}</li>
                <li>{t("premium.termsPayment")}</li>
                <li>{t("premium.termsScope")}</li>
                <li>{t("premium.termsNoCoolingOff")}</li>
                <li>{t("premium.termsRefund")}</li>
                <li>{t("premium.termsInvoice")}</li>
              </ul>
            </section>

            {/* 聯絡（email 與綠界註冊一致）；服務條款／隱私權連結走全站 footer */}
            <section className="space-y-2">
              <h2 className="text-xl font-bold">{t("premium.contactHeading")}</h2>
              <p className="text-sm">
                {t("premium.contactText")}{" "}
                <a
                  href="mailto:jsy-traintime@googlegroups.com"
                  className="text-silverLakeBlue-500 underline hover:text-silverLakeBlue-600 dark:text-silverLakeBlue-400 dark:hover:text-silverLakeBlue-300"
                >
                  jsy-traintime@googlegroups.com
                </a>
              </p>
            </section>
          </article>
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default Premium;
