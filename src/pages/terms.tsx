import Layout from "@/components/layout/Layout";
import useLang from "@/hooks/useLang";
import useMuiTheme from "@/hooks/useMuiTheme";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
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

/** 服務條款頁：OAuth 同意畫面必要連結 */
const Terms: FC = () => {
  const muiTheme = useMuiTheme();
  const { t } = useTranslation();
  const { isTw } = useLang();

  return (
    <MuiThemeProvider theme={muiTheme}>
      <Layout>
        <article className="mx-auto max-w-3xl space-y-4 leading-relaxed text-zinc-700 dark:text-zinc-200">
          {!isTw && (
            <p className="text-center text-zinc-500 dark:text-zinc-400">
              {t("pageOnlyTwMsg")}
            </p>
          )}
          <h1 className="text-3xl font-bold">服務條款</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            最後更新日期：2026 年 4 月 15 日
          </p>

          <p>
            歡迎使用 JSY 台鐵時刻查詢（以下簡稱「本服務」，網址：
            <a
              href="https://traintime.jsy.tw"
              className="text-silverLakeBlue-500 underline hover:text-silverLakeBlue-600"
            >
              https://traintime.jsy.tw
            </a>
            ）。在使用本服務前，請詳閱本服務條款。您一旦使用本服務即表示已閱讀、瞭解並同意本條款全部內容。
          </p>

          <h2 className="mt-6 text-xl font-bold">1. 服務內容</h2>
          <p>
            本服務為免費提供之台灣鐵路、台灣高鐵、桃園機場捷運等大眾運輸時刻查詢工具，並提供登入使用者收藏、個人化顯示等加值功能。
          </p>

          <h2 className="mt-6 text-xl font-bold">2. 資料來源與正確性</h2>
          <p>
            本服務所呈現之時刻、票價、車次等資訊，係取自交通部
            TDX（運輸資料流通服務平台）之公開資料介面，其資料來源為台鐵、高鐵、桃園機場捷運等營運單位。實際營運資訊以各運輸單位官方公告為準。本服務無法保證資料即時正確、完整或無誤，使用者應自行查證。
          </p>

          <h2 className="mt-6 text-xl font-bold">3. 使用者帳號</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>使用部分功能需透過 Google 登入建立帳號。</li>
            <li>您應妥善保管帳號與相關憑證，不得轉讓或提供他人使用。</li>
            <li>帳號活動造成之一切責任由您自行承擔。</li>
            <li>您得隨時透過本服務之設定或聯絡管理者刪除帳號。</li>
          </ul>

          <h2 className="mt-6 text-xl font-bold">4. 使用者行為規範</h2>
          <p>使用本服務時，您同意不從事下列行為：</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>以自動化程式、爬蟲等方式大量請求資料，影響服務穩定</li>
            <li>嘗試逆向工程、破解、干擾或繞過本服務之安全機制</li>
            <li>將本服務用於任何違法、侵權或損害他人權益之用途</li>
            <li>以未經授權之方式重製、散布、商業利用本服務內容</li>
          </ul>

          <h2 className="mt-6 text-xl font-bold">5. 智慧財產權</h2>
          <p>
            本服務之介面、程式碼、商標、Logo
            等智慧財產權歸本服務擁有者所有；車次資料之原始著作權歸屬各運輸單位。未經書面同意，您不得為商業用途重製、改作或散布。
          </p>

          <h2 className="mt-6 text-xl font-bold">6. 免責聲明</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              本服務依「現況」與「現有」提供，不保證無中斷、無錯誤或符合特定目的。
            </li>
            <li>
              因依據本服務資訊所為之行程規劃、票務決策、延誤、財產損失等，本服務擁有者概不負責。
            </li>
            <li>
              因第三方服務（Google、Firebase、運輸單位 API
              等）之故障、異常而導致之服務中斷，本服務擁有者不負賠償責任。
            </li>
          </ul>

          <h2 className="mt-6 text-xl font-bold">7. 服務變更與終止</h2>
          <p>
            本服務擁有者保留隨時修改、暫停或終止全部或部分服務之權利，無須事前通知。若因服務變更造成您之不便，本服務擁有者不負賠償責任。
          </p>

          <h2 className="mt-6 text-xl font-bold">8. 條款修訂</h2>
          <p>
            本條款可能不時更新，修訂後之條款將公告於本頁面並更新頁首日期。若您不同意修訂內容，請停止使用本服務；繼續使用即視為同意變更。
          </p>

          <h2 className="mt-6 text-xl font-bold">9. 準據法與管轄</h2>
          <p>
            本條款之解釋與適用，以及因本條款所生之爭議，均以中華民國法律為準據法，並以臺灣臺北地方法院為第一審管轄法院。
          </p>

          <h2 className="mt-6 text-xl font-bold">10. 聯絡方式</h2>
          <p>
            如對本條款有任何疑問，請來信：
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

export default Terms;
