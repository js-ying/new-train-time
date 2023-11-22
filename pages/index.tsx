import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();

  router.push({
    pathname: "/TR",
  });
};

export default Home;
