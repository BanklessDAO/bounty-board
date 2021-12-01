import { NextApiResponse } from "next";

export const notFound = (res: NextApiResponse) => res.status(404).json({ success: false, error: 'Not Found' });
