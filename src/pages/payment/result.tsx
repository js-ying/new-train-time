import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import useMuiTheme from "@/hooks/useMuiTheme";
import { getOrderStatus } from "@/services/checkoutService";
import { Button } from "@heroui/react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { FC, useCallback, useEffect, useRef, useState } from "react";

/**
 * 綠界以 client-side POST 導回此頁（OrderResultURL），故用 getServerSideProps（POST 不適用靜態頁）。
 * 不在 server 端讀付款參數、不解鎖 —— 解鎖只信 webhook；此頁僅反映「這筆訂單」狀態 + 刷新 profile。
 */
export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

/** 結帳前在 sessionStorage 暫存的本次訂單號 key（premium.tsx 寫入） */
const PENDING_ORDER_KEY = "pendingOrderMtn";
/** webhook 可能比導回慢，輪詢間隔與上限（2.5s × 12 ≈ 30s） */
const POLL_INTERVAL_MS = 2500;
const MAX_POLLS = 12;
/** 手動刷新冷卻：自動輪詢已每 2.5s 查一次，這裡防使用者連點灌爆 getOrderStatus */
const REFRESH_COOLDOWN_MS = 3000;

type ViewState = "processing" | "paid" | "failed";

const readPendingMtn = (): string => {
  try {
    return sessionStorage.getItem(PENDING_ORDER_KEY) ?? "";
  } catch {
    return "";
  }
};
const clearPendingMtn = (): void => {
  try {
    sessionStorage.removeItem(PENDING_ORDER_KEY);
  } catch {
    /* ignore */
  }
};

const PaymentResult: FC = () => {
  const muiTheme = useMuiTheme();
  const { t } = useTranslation();
  const { refreshProfile } = useAuth();
  const [view, setView] = useState<ViewState>("processing");
  /** 手動刷新「進行中或冷卻中」（請求結束後再撐滿冷卻才解鎖，不受自動輪詢影響） */
  const [refreshing, setRefreshing] = useState(false);
  /** 冷卻計時器，卸載時清掉避免 setState after unmount */
  const cooldownTimerRef = useRef<number>();

  /** 查「這筆」訂單狀態決定畫面；回傳是否已達終局（paid/failed） */
  const checkOrder = useCallback(
    async (mtn: string): Promise<boolean> => {
      try {
        const { status } = await getOrderStatus(mtn);
        if (status === "paid") {
          setView("paid");
          clearPendingMtn();
          await refreshProfile(); // 解鎖全站 UI（AdBanner 等）
          return true;
        }
        if (status === "failed" || status === "refunded") {
          setView("failed");
          clearPendingMtn();
          return true;
        }
      } catch {
        // 未登入/網路暫時失敗 → 當作還沒好，續等
      }
      return false; // created / not_found → 尚未完成
    },
    [refreshProfile],
  );

  // 進頁自動輪詢：以「這筆訂單」是否 paid 為準，與「是不是會員」脫鉤
  useEffect(() => {
    const mtn = readPendingMtn();
    if (!mtn) {
      // 無待確認訂單（直接訪問）→ 僅刷新一次會員狀態
      void refreshProfile();
      return;
    }
    let cancelled = false;
    let attempts = 0;
    let timer: number;
    const loop = async () => {
      if (cancelled) return;
      attempts += 1;
      const done = await checkOrder(mtn);
      if (cancelled) return;
      if (done || attempts >= MAX_POLLS) {
        return;
      }
      timer = window.setTimeout(loop, POLL_INTERVAL_MS);
    };
    timer = window.setTimeout(loop, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [checkOrder, refreshProfile]);

  // 卸載時清掉冷卻計時器
  useEffect(
    () => () => window.clearTimeout(cooldownTimerRef.current),
    [],
  );

  const handleManualRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const mtn = readPendingMtn();
      if (mtn) await checkOrder(mtn);
      else await refreshProfile();
    } finally {
      // 請求結束後再撐滿冷卻才解鎖，連點期間維持 loading
      cooldownTimerRef.current = window.setTimeout(
        () => setRefreshing(false),
        REFRESH_COOLDOWN_MS,
      );
    }
  };

  const titleKey =
    view === "paid"
      ? "paymentResult.successTitle"
      : view === "failed"
        ? "paymentResult.failedTitle"
        : "paymentResult.processingTitle";
  const msgKey =
    view === "paid"
      ? "paymentResult.successMsg"
      : view === "failed"
        ? "paymentResult.failedMsg"
        : "paymentResult.processingMsg";

  return (
    <>
      <NextSeo title={t("paymentResult.pageTitle")} noindex nofollow />
      <MuiThemeProvider theme={muiTheme}>
        <Layout>
          <article className="mx-auto mt-10 w-full max-w-xl space-y-5 text-center leading-relaxed text-zinc-700 dark:text-zinc-200 sm:mt-14">
            <h1 className="text-2xl font-bold">{t(titleKey)}</h1>
            <p className="text-zinc-600 dark:text-zinc-300">{t(msgKey)}</p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              {view !== "paid" && (
                <Button
                  color="primary"
                  radius="sm"
                  onPress={handleManualRefresh}
                  isDisabled={refreshing}
                  isLoading={refreshing}
                >
                  {t("paymentResult.refreshBtn")}
                </Button>
              )}
              <Button as={Link} href="/" variant="bordered" radius="sm">
                {t("paymentResult.backHome")}
              </Button>
            </div>
          </article>
        </Layout>
      </MuiThemeProvider>
    </>
  );
};

export default PaymentResult;
