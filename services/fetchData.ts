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

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};

export default fetchData;
