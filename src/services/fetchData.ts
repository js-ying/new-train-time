const fetchData = async (url = "", data = {}, method = "POST") => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: method !== "GET" ? JSON.stringify(data) : null,
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result;
  } catch (error) {
    console.log(error);
    // 有 error.code 表示為後端回傳可預期錯誤，若無則表示網路錯誤
    throw new Error(
      error.code ? `${error.code} ${error.message}` : "Internal Server Error",
    );
  }
};

export default fetchData;
