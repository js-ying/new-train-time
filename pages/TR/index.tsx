import { useMemo } from "react";
import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";
import Layout from "../../components/Layout";
import SearchArea from "../../components/SearchArea";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}

export default function TrHome() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: `${theme === "light" ? "#6490c4" : "rgb(245 158 11)"}`,
            dark: `${theme === "light" ? "#6490c4" : "rgb(245 158 11)"}`,
          },
          mode: theme as "light" | "dark",
        },
      }),
    [theme],
  );
  return (
    <Layout title={t("title")}>
      <MuiThemeProvider theme={muiTheme}>
        <SearchArea />
      </MuiThemeProvider>
    </Layout>
  );
}
