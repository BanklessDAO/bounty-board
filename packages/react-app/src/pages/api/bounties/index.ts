import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Bounty from '../../../models/Bounty';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	const { method } = req;
	const status: string = req.query.status as string;
	const search: string = req.query.search as string;

	await dbConnect();

	switch (method) {
	case 'GET':
		try {
			let bounties = [];
			bounties = await handleFilters(status, search);
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

const handleFilters = async (status: string, search: string): Promise<any> => {
	let filterQuery: {status?: any, $text?: any};
	if (status == null || status == '' || status == 'All') {
		filterQuery = { status: ['Open', 'In-Progress', 'In-Review', 'Completed'] };
	} else {
		filterQuery = { status: status };
	}

	if (!(search == null || search == '')) {
		filterQuery['$text'] = { $search: search };
	}

	const isEmpty: boolean = Object.values(filterQuery).every(x => x === null || x === '');
	filterQuery = isEmpty ? {} : filterQuery;
	return Bounty.find(filterQuery);
};