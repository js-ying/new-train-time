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

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
}
