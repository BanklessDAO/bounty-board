import { NextApiRequest, NextApiResponse } from "next";

export default async function (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
  if (req.method = 'GET') res.status(200).json({ 'Message': 'Welcome to the bountyboard API' });
};
