import { useState } from "react";
import Layout from "../../components/Layout";
import SearchArea from "../../components/SearchArea";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <Layout title="台鐵時刻查詢" setActiveIndex={setActiveIndex}>
      <SearchArea
        startStation={""}
        endStation={""}
        datetime={""}
        stationList={[]}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    </Layout>
  );
}
