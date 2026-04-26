import { createTheme } from "@mui/material/styles";
import { useTheme } from "next-themes";
import { useMemo } from "react";

const useMuiTheme = () => {
  // 使用 resolvedTheme：next-themes 在使用者選「跟隨系統」時，theme 會是 "system"，
  // 而 MUI palette.mode 只接受 "light" | "dark"，否則會丟出
  // 「The palette mode `system` is not supported.」錯誤。
  const { resolvedTheme } = useTheme();
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: `${resolvedTheme === "light" ? "#6490c4" : "#f59e0b"}`,
            dark: `${resolvedTheme === "light" ? "#6490c4" : "#f59e0b"}`,
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
          fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            "PingFang TC",
            "Roboto",
            "Microsoft YaHei",
            "Arial",
            "sans-serif",
          ].join(","),
        },
        components: {
          MuiListItemButton: {
            styleOverrides: {
              root: {
                "&:focus-visible": {
                  outline: "2px solid",
                  outlineColor: `${resolvedTheme === "light" ? "#6490c4" : "#f59e0b"}`,
                  outlineOffset: "2px",
                },
              },
            },
          },
        },
      }),
    [resolvedTheme],
  );

  return muiTheme;
};

export default useMuiTheme;
