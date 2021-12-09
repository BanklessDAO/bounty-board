import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import * as service from '../../../services/bounty.service';
import validate from '../../../middlewares/validate';
import { BountySchema } from '../../../models/Bounty';

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	const { method } = req;
	const filters = service.getFilters(req.query);
	const sort = service.getSort(req.query);

	await dbConnect();

	switch (method) {
	case 'GET': {
		try {
			const bounties = await service.getBounties(filters, sort);
			res.status(200).json({ success: true, data: bounties });
		} catch (error) {
			res.status(400).json({ success: false });
		}
		break;
	}
	case 'POST': {
		const bounty = await service.createBounty(req.body);
		res.status(200).json({ success: true, data: bounty });
		break;
	}
	default: {
		res.status(400).json({ success: false });
		break;
	}
	}
};

export default validate({ schema: BountySchema, handler });

