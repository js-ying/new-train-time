import Layout from "@/components/layout/Layout";
import useMuiTheme from "@/hooks/useMuiTheme";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FC } from "react";

/** 供 next-i18next 於建置時注入翻譯檔（此頁目前僅中文，但保留以維持一致性） */
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

/** 隱私權政策頁：OAuth 同意畫面必要連結 */
const Privacy: FC = () => {
  const muiTheme = useMuiTheme();

  return (
    <MuiThemeProvider theme={muiTheme}>
      <Layout>
        <article className="mx-auto max-w-3xl space-y-4 leading-relaxed text-zinc-700 dark:text-zinc-200">
          <h1 className="text-3xl font-bold">隱私權政策</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            最後更新日期：2026 年 4 月 15 日
          </p>

          <p>
            感謝您使用 JSY 台鐵時刻查詢（以下簡稱「本服務」，網址：
            <a
              href="https://traintime.jsy.tw"
              className="text-silverLakeBlue-500 underline hover:text-silverLakeBlue-600"
            >
              https://traintime.jsy.tw
            </a>
            ）。本政策說明我們如何蒐集、使用及保護您的個人資料。
          </p>

          <h2 className="mt-6 text-xl font-bold">1. 我們蒐集的資料</h2>
          <p>當您使用本服務時，我們可能蒐集下列資料：</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Google 帳號登入資料</strong>：若您使用 Google
              登入，我們透過 Firebase Authentication 取得您的
              email、顯示名稱、個人頭像網址與 Google 使用者 ID。
            </li>
            <li>
              <strong>使用者偏好設定</strong>
              ：語系、主題、歷史快查等，用於個人化服務。
            </li>
            <li>
              <strong>裝置與連線資訊</strong>：瀏覽器類型、作業系統、IP
              位址、存取時間等基礎網站記錄。
            </li>
          </ul>

          <h2 className="mt-6 text-xl font-bold">2. 資料用途</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>提供車次查詢、收藏、個人化顯示等核心功能</li>
            <li>維持並改善服務品質，除錯與效能分析</li>
            <li>防止濫用、詐騙與違法行為</li>
            <li>必要時依法律要求提供予主管機關</li>
          </ul>

          <h2 className="mt-6 text-xl font-bold">3. 資料儲存與安全</h2>
          <p>
            您的資料儲存於 Google Firebase（Google Cloud
            Platform）基礎設施中，並受其安全機制保護。我們採用業界通用的加密傳輸（HTTPS）與存取控管措施，盡合理努力避免資料外洩。
          </p>

          <h2 className="mt-6 text-xl font-bold">4. 第三方服務</h2>
          <p>本服務使用下列第三方服務，該等服務可能各自蒐集必要資料：</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Google Firebase（驗證、資料庫、Hosting）</li>
            <li>
              交通部
              TDX（運輸資料流通服務平台）提供之台鐵、高鐵、桃園機場捷運等公開交通資料
            </li>
          </ul>
          <p>我們不會將您的個人資料出售、出租或以營利為目的提供予第三方。</p>

          <h2 className="mt-6 text-xl font-bold">5. Cookie 與本地儲存</h2>
          <p>
            本服務使用 Cookie 與瀏覽器 LocalStorage
            以保存登入狀態與使用者偏好。您可透過瀏覽器設定停用
            Cookie，但部分功能可能因此無法正常運作。
          </p>

          <h2 className="mt-6 text-xl font-bold">6. 您的權利</h2>
          <p>依據中華民國個人資料保護法及 GDPR 等相關規範，您有權：</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>查詢、閱覽您的個人資料</li>
            <li>請求製給複本、補充或更正</li>
            <li>請求停止蒐集、處理、利用或刪除</li>
          </ul>
          <p>如需行使上述權利，請透過下方聯絡方式與我們聯繫。</p>

          <h2 className="mt-6 text-xl font-bold">7. 兒童隱私</h2>
          <p>
            本服務非針對 13
            歲以下兒童設計。若發現未成年人在未取得監護人同意下提供個人資料，將立即刪除該等資料。
          </p>

          <h2 className="mt-6 text-xl font-bold">8. 政策變更</h2>
          <p>
            本政策可能因法律或服務調整而修訂，修訂版本將公告於本頁面並更新頁首日期。繼續使用本服務即視為您同意變更後的政策。
          </p>

          <h2 className="mt-6 text-xl font-bold">9. 聯絡我們</h2>
          <p>
            如對本政策有任何疑問，請來信：
            <a
              href="mailto:jsy-traintime@googlegroups.com"
              className="text-silverLakeBlue-500 underline hover:text-silverLakeBlue-600"
            >
              jsy-traintime@googlegroups.com
            </a>
          </p>
        </article>
      </Layout>
    </MuiThemeProvider>
  );
};

export default Privacy;
