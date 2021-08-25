import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Bounty from '../../../models/Bounty';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	const { method } = req;
	const { status } = req.query;

	await dbConnect();

	switch (method) {
	case 'GET':
		try {
			let bounties = [];
			if (status == null || status === '' || status === 'All') {
				bounties = await Bounty.find({
					status: ['Open', 'In-Progress', 'In-Review', 'Completed'],
				});
			} else {
				bounties = await Bounty.find({
					status: status,
				});
			}
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
