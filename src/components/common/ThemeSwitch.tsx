import { GaEnum } from "@/enums/GaEnum";
import useSetting from "@/hooks/useSetting";
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

/**
 * 亮暗色主題切換器
 * - 實際 icon 依 next-themes 的 resolvedTheme 決定（會把 "system" 解析成實際 light/dark）
 * - 點擊後以 useSetting 寫入 SettingContext；套用 UI 與寫 meta theme-color 由 ThemeSyncer 統一處理
 */
const ThemeSwitch: FC = () => {
  const [mounted, setMounted] = useState(false);
  const [, setThemeSetting] = useSetting("theme");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  /** 切換亮暗色：明確寫入 light 或 dark（不保留 system） */
  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setThemeSetting(next);
    gaClickEvent(next === "light" ? GaEnum.LIGHT_MODE : GaEnum.DARK_MODE);
  };

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label="Change theme"
      className="custom-cursor-pointer inline-block"
      onClick={toggleTheme}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          toggleTheme();
        }
      }}
    >
      {isDark ? <LightModeIcon /> : <DarkModeIcon />}
    </div>
  );
};

export default ThemeSwitch;
