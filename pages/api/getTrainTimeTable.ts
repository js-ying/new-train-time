export default async function handler(req, res) {
  const { startStationId, endStationId, date, time } = req.body;

  try {
    const response = await fetch(
      `${process.env.TRAIN_TIME_BACKEND_ENDPOINT}/api/getTrainTimeTable`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startStationId,
          endStationId,
          date,
          time,
        }),
      },
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
