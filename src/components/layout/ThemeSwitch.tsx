import { GaEnum } from "@/enums/GaEnum";
import { gaClickEvent } from "@/utils/GaUtils";
import { useTheme } from "next-themes";
import { FC, useEffect, useState } from "react";

const LightModeIcon: FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`rotate h-6 w-6`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  );
};

const DarkModeIcon: FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`rotate h-6 w-6`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
      />
    </svg>
  );
};

/** 亮暗色主題切換器 */
const ThemeSwitch: FC = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // 透過 localStorage 檢查儲存的主題設定，若不存在則使用系統模式
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const userPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (storedTheme) {
      setTheme(storedTheme);
      setMetaThemeColor(storedTheme);
    } else {
      setTheme(userPrefersDark ? "dark" : "light");
      setMetaThemeColor(userPrefersDark ? "dark" : "light");
    }

    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const mode = theme === "light" ? "dark" : "light";
    setTheme(mode);
    setMetaThemeColor(mode);
    localStorage.setItem("theme", mode);
    gaClickEvent(mode === "light" ? GaEnum.LIGHT_MODE : GaEnum.DARK_MODE);
  };

  // 設定 META 主題顏色（for PWA 時工具列的背景顏色）
  const setMetaThemeColor = (mode: string) => {
    document
      .querySelector("meta[name='theme-color']")
      .setAttribute("content", mode === "light" ? "#FFFFFF" : "#212529");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div
      tabIndex={0}
      role="button"
      className="custom-cursor-pointer inline-block"
      onClick={toggleTheme}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          toggleTheme();
        }
      }}
    >
      {theme === "dark" && <LightModeIcon />}
      {theme === "light" && <DarkModeIcon />}
    </div>
  );
};

export default ThemeSwitch;
