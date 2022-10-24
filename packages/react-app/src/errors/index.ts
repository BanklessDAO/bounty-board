import { NextApiResponse } from 'next';

export const notFound = (res: NextApiResponse): void =>
	res.status(404).json({ success: false, error: 'Not Found' });
export const internalServerError = (res: NextApiResponse): void =>
	res.status(500).json({ success: false, error: 'Internal Server Error' });

export class NotImplementedError extends Error {
	constructor(message = 'Route not implemented') {
		super(message);
		this.name = 'NotImplementedError';
	}
}

export const WARNINGS = {
	ADBLOCKER:
    'Page not working as expected? Adblockers such as Privacy Badger have been known to cause interference with the bounty board, please try disabling.',
};
