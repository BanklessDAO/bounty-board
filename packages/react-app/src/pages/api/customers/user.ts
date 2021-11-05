import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import * as service from '../../../services/customer.service';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	await dbConnect();

	switch (req.method) {
	case 'POST':
		try {
			// console.debug({ body: req.body });
			const data = await service.getCustomersInUsersGuilds(JSON.parse(req.body));
			console.debug({ data });
			res.status(200).json({ success: true, data });
		} catch (error) {
			console.debug({ error });
			res.status(400).json({ success: false, message: error });
		}
		break;
	default:
		res.status(400).json({ success: false });
		break;
	}
}

