import { NextApiRequest, NextApiResponse } from 'next';

export default async function(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	switch (req.method) {
	case 'GET': {
		res.status(200).json({ 'Message': 'Welcome to the bountyboard API' });
		break;
	}
	default: {
		res.status(400).json({ 'Message': 'Method not implemented' });
	}
	}
}
