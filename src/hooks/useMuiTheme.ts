import { BRAND_PRIMARY_HEX } from "@/configs/themeColors";
import { createTheme } from "@mui/material/styles";
import { useTheme } from "next-themes";
import { useMemo } from "react";

const useMuiTheme = () => {
  // 使用 resolvedTheme：next-themes 在使用者選「跟隨系統」時，theme 會是 "system"，
  // 而 MUI palette.mode 只接受 "light" | "dark"，否則會丟出
  // 「The palette mode `system` is not supported.」錯誤。
  const { resolvedTheme } = useTheme();
  // 主色對齊全站 semantic token：亮 silverLakeBlue-500 / 暗 gamboge-500
  const primaryColor =
    resolvedTheme === "light" ? BRAND_PRIMARY_HEX.light : BRAND_PRIMARY_HEX.dark;
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: primaryColor,
            dark: primaryColor,
          },
          mode: resolvedTheme === "dark" ? "dark" : "light",
          background: {
            paper: "#FFFFFF",
          },
          text: {
            primary: `${resolvedTheme === "light" ? "#000000" : "#FFFFFF"}`,
          },
          action: {
            focus: null,
          },
        },
        typography: {
          // 與 body 共用同一組字體變數，避免 MUI 元件（Sidebar / 日期選擇器）
          // 落回系統字體而與全站字重不一致。順序對齊 global.scss：
          // --font-app-latin（Inter，英數）在前、--font-app-sans（Noto，CJK）在後。
          fontFamily: "var(--font-app-latin), var(--font-app-sans)",
          // 內文 base 字重對齊 global.scss 的 500（Medium）。
          fontWeightRegular: 500,
        },
        components: {
          MuiListItemIcon: {
            styleOverrides: {
              // icon 跟隨 text.primary，與 label 同色（light 黑 / dark 白）
              root: ({ theme }) => ({
                color: theme.palette.text.primary,
              }),
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                "&:focus-visible": {
                  outline: "2px solid",
                  outlineColor: primaryColor,
                  outlineOffset: "2px",
                },
              },
            },
          },
        },
      }),
    [resolvedTheme, primaryColor],
  );

  return muiTheme;
};

export default useMuiTheme;
