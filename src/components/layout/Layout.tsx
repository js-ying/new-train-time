import LocaleChange from "@/components/common/LocaleChange";
import ThemeSwitch from "@/components/common/ThemeSwitch";
// import UserAvatar from "@/components/common/UserAvatar";
import WebTitle from "@/components/common/WebTitle";
import { FC } from "react";
import Sidebar from "../sidebar/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  /** 頁尾，會渲染在 <main> 之外，作為 flex-col 的最後一個子元素 */
  footer?: React.ReactNode;
}

/** 全站共用 Layout，包含頂部導覽列與側欄 */
const Layout: FC<LayoutProps> = ({ children, title = "", footer }) => {
  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-4 py-6">
      <div className="relative mb-6">
        <div className="absolute left-0 top-0.5">
          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
            <Sidebar />
          </div>
        </div>
        <div className="flex items-center justify-center gap-1">
          <WebTitle />
        </div>
        <div className="absolute right-0 top-0.5">
          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
            {/* 使用者登入按鈕（暫時隱藏） */}
            {/* <UserAvatar /> */}
            {/* 語系切換 */}
            <LocaleChange />
            {/* 亮暗色主題切換 */}
            <ThemeSwitch />
          </div>
        </div>
      </div>
      {/* 主內容區，flex-1 撐滿讓 footer 自然黏底 */}
      <main className="flex-1">{children}</main>
      {footer}
    </div>
  );
};

export default Layout;
