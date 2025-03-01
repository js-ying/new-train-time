import { FC } from "react";
import LocaleChange from "../buttons/LocaleChange";
import ThemeSwitch from "../buttons/ThemeSwitch";
import Sidebar from "./Sidebar";
import WebTitle from "./WebTitle";

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
        <h2 className="flex items-center justify-center gap-1">
          <WebTitle />
        </h2>
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
