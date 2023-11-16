import Layout from "../../components/Layout";
import SearchArea from "../../components/SearchArea";

export default function Home() {
  return (
    <Layout title="台鐵時刻查詢">
      <SearchArea
        startStation={""}
        endStation={""}
        datetime={""}
        stationList={[]}
      />
    </Layout>
  );
}
