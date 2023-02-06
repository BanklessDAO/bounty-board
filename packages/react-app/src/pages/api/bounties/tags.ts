import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import * as service from '../../../services/bounty.service';

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	await dbConnect();

	switch (req.method) {
	case 'GET': {
		try {
			const { customerId } = req.query;
			if (!customerId || typeof customerId !== 'string') {
				return res.status(400).json({
					success: false,
					error: 'Missing customer Id field or specified multiple',
				});
			}
			const tags = await service.getTags(customerId);
			res.status(200).json({
				success: true,
				data: {
					tags,
				},
			});
		} catch (error) {
			console.warn(error);
			res.status(400).json({ success: false, error });
		}
		break;
	}

	default: {
		res.status(400).json({ success: false });
		break;
	}
	}
};

export default handler;
