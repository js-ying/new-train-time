import ChevronToggleIcon from "@/components/common/ChevronToggleIcon";
import CommonDialog from "@/components/common/CommonDialog";
import Layout from "@/components/layout/Layout";
import { PREMIUM_PLANS } from "@/configs/premiumPlans";
import { isAuthError, useAuth } from "@/contexts/AuthContext";
import useMuiTheme from "@/hooks/useMuiTheme";
import type { MembershipPlanCode } from "@/models/membership";
import { createCheckout } from "@/services/checkoutService";
import { submitEcpayForm } from "@/utils/submitEcpayForm";
import { Accordion, AccordionItem, Checkbox } from "@heroui/react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { FC, useRef, useState } from "react";

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
 * 付費方案介紹頁。
 */
const Premium: FC = () => {
  const muiTheme = useMuiTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { user, loginWithGoogle, notifySessionExpired } = useAuth();

  // 消保法：結帳前須勾選同意排除七日猶豫期，未勾不可購買
  const [consent, setConsent] = useState(false);
  // 購買須知 Accordion 受控開合；同意句中的「購買須知」可點擊展開
  const [termsOpen, setTermsOpen] = useState(false);
  const termsRef = useRef<HTMLDivElement>(null);

  // 點同意句中的連結：展開須知並捲動定位（連結在 label 內，須阻止冒泡以免誤觸勾選）
  const openTerms = () => {
    setTermsOpen(true);
    termsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };
  // 正在建單導轉中的方案（導轉為整頁跳轉，成功後不會回到本頁）
  const [submittingPlan, setSubmittingPlan] =
    useState<MembershipPlanCode | null>(null);
  const [checkoutError, setCheckoutError] = useState(false);

  const handleBuy = async (planCode: MembershipPlanCode) => {
    if (submittingPlan) return;
    // 未登入：先觸發登入，登入後使用者再點一次購買
    if (!user) {
      void loginWithGoogle();
      return;
    }
    setSubmittingPlan(planCode);
    try {
      const { actionUrl, params } = await createCheckout(
        planCode,
        user,
        router.locale,
      );
      // 暫存本次訂單號，導回 /payment/result 後用來輪詢「這筆」是否付款成功。
      try {
        localStorage.setItem("pendingOrderMtn", params.MerchantTradeNo);
      } catch {
        // localStorage 不可用（隱私模式等）→ 略過，導回頁退回看會員狀態
      }
      submitEcpayForm(actionUrl, params); // 整頁導轉綠界，後續不會回到這
    } catch (err) {
      if (isAuthError(err)) {
        notifySessionExpired();
      } else {
        console.error("建立結帳失敗", err);
        setCheckoutError(true);
      }
      setSubmittingPlan(null);
    }
  };

  // 一般會員 vs 付費會員 權益比較
  const compareRows = [
    { label: t("syncSettingsBenefit"), basic: true, premium: true },
    { label: t("favoriteRoutesBenefit"), basic: true, premium: true },
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
                      <th className="py-2 pr-3 text-left font-semibold">
                        {t("premium.compareFeature")}
                      </th>
                      <th className="px-3 py-2 font-semibold">
                        <span className="flex justify-center">
                          {t("basicMember")}
                        </span>
                      </th>
                      <th className="px-3 py-2 font-semibold text-primary">
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
                        className="border-b border-zinc-200 dark:border-zinc-700"
                      >
                        <td className="py-2 pr-3">{row.label}</td>
                        <td className="px-3 py-2">
                          <span className="flex justify-center text-zinc-400">
                            {row.basic ? "✓" : "—"}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="flex justify-center font-medium text-primary">
                            {row.premium ? "✓" : "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 方案 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold">{t("premium.plansHeading")}</h2>
              
              <Accordion
                ref={termsRef}
                variant="bordered"
                className="rounded-md border-small border-zinc-200 px-0 dark:border-zinc-700"
                selectedKeys={termsOpen ? ["terms"] : []}
                onSelectionChange={(keys) =>
                  setTermsOpen((keys as Set<string>).has("terms"))
                }
                itemClasses={{
                  title:
                    "text-sm font-semibold text-zinc-700 dark:text-zinc-200",
                  trigger: "px-3 py-3",
                  // 內容與標題以細線分隔，並留左右下 padding，避免條文貼齊邊框
                  content:
                    "border-t border-zinc-200 px-3 pb-3 pt-3 text-sm leading-relaxed text-zinc-600 dark:border-zinc-700 dark:text-zinc-300",
                }}
              >
                <AccordionItem
                  key="terms"
                  aria-label={t("premium.termsHeading")}
                  title={t("premium.termsHeading")}
                  disableIndicatorAnimation
                  indicator={({ isOpen }) => (
                    <ChevronToggleIcon expanded={isOpen} className="size-4" />
                  )}
                >
                  <ul className="list-disc space-y-1.5 pl-5">
                    <li>{t("premium.termsOneTime")}</li>
                    <li>{t("premium.termsExpiry")}</li>
                    <li>{t("premium.termsPayment")}</li>
                    <li>{t("premium.termsScope")}</li>
                    <li>{t("premium.termsNoCoolingOff")}</li>
                    <li>{t("premium.termsRefund")}</li>
                    <li>{t("premium.termsInvoice")}</li>
                  </ul>
                </AccordionItem>
              </Accordion>

              {/* 消保：結帳前同意排除七日猶豫期；未勾選不可購買。
                  連結放在 Checkbox 外的 span，避開 react-aria 對整個 label 的
                  press 捕捉（巢狀互動元素點不到）；點純文字仍由 span 切換勾選 */}
              <div className="flex items-start gap-2">
                <Checkbox
                  isSelected={consent}
                  onValueChange={setConsent}
                  color="primary"
                  size="sm"
                  aria-labelledby="consent-waive-label"
                  // 框 16px、文字行高 20px，往下推 2px 對齊首行中線
                  classNames={{ base: "m-0 mt-0.5 p-0" }}
                />
                <span
                  id="consent-waive-label"
                  className="-ml-2 cursor-pointer text-sm text-zinc-600 dark:text-zinc-300"
                  onClick={() => setConsent(!consent)}
                >
                  <Trans
                    i18nKey="premium.consentWaiveCoolingOff"
                    components={[
                      <button
                        key="terms"
                        type="button"
                        onClick={(e) => {
                          // 連結獨立行為：阻止冒泡避免一併切換勾選
                          e.stopPropagation();
                          openTerms();
                        }}
                        className="text-primary underline underline-offset-2 hover:opacity-80"
                      />,
                    ]}
                  />
                </span>
              </div>
              {!user && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t("premium.loginHint")}
                </p>
              )}

              <ul className="grid gap-3 sm:grid-cols-3">
                {PREMIUM_PLANS.map((plan) => {
                  const perMonth = Math.round(plan.priceTwd / plan.months);
                  const isBest = plan.code === "12m";
                  const monthlyBase =
                    PREMIUM_PLANS.find((p) => p.code === "1m")?.priceTwd ?? 0;
                  const listPrice = monthlyBase * plan.months;
                  const saved = listPrice - plan.priceTwd;
                  const savedPct =
                    listPrice > 0 ? Math.round((saved / listPrice) * 100) : 0;
                  const buyable = consent && submittingPlan === null;
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
                        <span className="absolute -top-2 right-3 rounded-full bg-primary px-2 py-0.5 text-xxs font-semibold text-primary-foreground">
                          {t("premium.planBestValue", { saved })}
                        </span>
                      )}
                      <p className="text-base font-semibold">
                        {t(`premium.plan${plan.code}`)}
                      </p>
                      <p className="text-2xl font-bold">
                        {t("premium.planTotal", { price: plan.priceTwd })}
                      </p>
                      {/* 原價刪除線 */}
                      {saved > 0 && (
                        <p className="text-sm">
                          <span className="text-zinc-400 line-through dark:text-zinc-500">
                            {t("premium.planTotal", { price: listPrice })}
                          </span>
                          <span className="ml-2 font-semibold text-primary">
                            {t("premium.planDiscount", { pct: savedPct })}
                          </span>
                        </p>
                      )}
                      <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
                        {t("premium.planPerMonth", { price: perMonth })}
                      </p>
                      <button
                        type="button"
                        disabled={!buyable}
                        onClick={() => handleBuy(plan.code)}
                        title={
                          !consent ? t("premium.consentRequired") : undefined
                        }
                        className={
                          buyable
                            ? "mt-auto w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                            : "mt-auto w-full cursor-not-allowed rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
                        }
                      >
                        {submittingPlan === plan.code
                          ? t("premium.redirecting")
                          : t("premium.buyCta")}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {!consent && (
                <p className="text-sm text-zinc-400 dark:text-zinc-500">
                  {t("premium.consentRequired")}
                </p>
              )}
            </section>

            {/* 聯絡；服務條款／隱私權連結走全站 footer */}
            <section className="space-y-2">
              <h2 className="text-xl font-bold">
                {t("premium.contactHeading")}
              </h2>
              <p className="">
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

          {/* 建立結帳失敗（非 401）提示 */}
          <CommonDialog
            open={checkoutError}
            setOpen={setCheckoutError}
            title="premium.checkoutFailedTitle"
            confirmText="gotItLabel"
          >
            {t("premium.checkoutFailed")}
          </CommonDialog>
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default Premium;
