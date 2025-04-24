import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const clientIp =
    (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;

  try {
    const response = await fetch(
      `${process.env.THSR_TRAIN_TIME_BACKEND_ENDPOINT}/api/getJsyTymcAlert`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": clientIp,
        },
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
