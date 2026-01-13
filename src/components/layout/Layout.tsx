import LocaleChange from "@/components/common/LocaleChange";
import ThemeSwitch from "@/components/common/ThemeSwitch";
import WebTitle from "@/components/common/WebTitle";
import { FC } from "react";
import Sidebar from "../sidebar/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: FC<LayoutProps> = ({ children, title = "" }) => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
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
          <div className="fade-in flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
            <LocaleChange />
            <ThemeSwitch />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Layout;
