import { NextApiResponse } from 'next';

export const notFound = (res: NextApiResponse): void => res.status(404).json({ success: false, error: 'Not Found' });
export const internalServerError = (res: NextApiResponse): void => res.status(500).json({ success: false, error: 'Internal Server Error' });