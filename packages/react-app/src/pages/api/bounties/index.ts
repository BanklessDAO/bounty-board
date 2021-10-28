import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import { getFilters, getSort, handleFiltersAndSorts } from './bounty.service';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	const { method } = req;
	const filters = getFilters(req.query);
	const sort = getSort(req.query);

	await dbConnect();

	switch (method) {
	case 'GET':
		try {
			let bounties = [];
			bounties = await handleFiltersAndSorts(filters, sort);
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

