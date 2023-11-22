import Layout from "../../components/Layout";
import SearchArea from "../../components/SearchArea";
import { SearchAreaProvider } from "../../contexts/SearchAreaContext";

export default function Home() {
  return (
    <SearchAreaProvider>
      <Layout title="台鐵時刻查詢">
        <SearchArea stationList={[]} />
      </Layout>
    </SearchAreaProvider>
  );
}
