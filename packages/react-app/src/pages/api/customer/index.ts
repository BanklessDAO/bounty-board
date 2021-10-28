import Customer from '../../../models/Customer';
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {

	await dbConnect();

	switch (req.method) {
	case 'GET':
		try {
			let bounties = [];
			bounties = await Customer.find();
			res.status(200).json({ success: true, data: bounties });
		} catch (error) {
			res.status(400).json({ success: false });
		}
		break;
	default:
		res.status(400).json({ success: false });
		break;
	}
}
