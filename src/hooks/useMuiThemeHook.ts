import { createTheme } from "@mui/material";
import { useTheme } from "next-themes";
import { useMemo } from "react";

const useMuiTheme = () => {
  const { theme } = useTheme();
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: `${theme === "light" ? "#6490c4" : "#f59e0b"}`,
            dark: `${theme === "light" ? "#6490c4" : "#f59e0b"}`,
          },
          mode: theme as "light" | "dark",
          background: {
            paper: "#FFFFFF",
          },
          text: {
            primary: `${theme === "light" ? "#000000" : "#FFFFFF"}`,
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
      }),
    [theme],
  );

  return muiTheme;
};

export default useMuiTheme;
