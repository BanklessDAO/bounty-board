import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import { getCustomer } from '../../../services/customer.service';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	const {
		query: { id },
		method,
	} = req;

	await dbConnect();

	switch (method) {
	case 'GET':
		try {
			if (typeof id === 'string') {
				const customer = await getCustomer(id);
				res.status(200).json({ success: true, data: customer });
			} else {
				res.status(400).json({ success: false, message: 'id must be a string' });
			}
		} catch (error) {
			res.status(404).json({ success: false });
		}
		break;
	default:
		res.status(400).json({ success: false });
		break;
	}
}
