import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import * as service from '../../../services/bounty.service';
import { BountySchema } from '../../../models/Bounty';
import middlewares from '../../../middlewares';

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	await dbConnect();

	switch (req.method) {
	case 'GET': {
		try {
			const bounties = await service.getBounties(req);
			const { results, ...paginationStats } = bounties;
			const resultsPerPage = Array.isArray(results) ? results.length : 0;
			res.status(200).json({
				success: true,
				data: results,
				resultsPerPage,
				...paginationStats,
			});
		} catch (error) {
			console.warn(error);
			res.status(400).json({ success: false, error });
		}
		break;
	}

	case 'POST': {
		try {
			const bounty = await service.createBounty(req.body);
			res.status(201).json({ success: true, data: bounty });
		} catch (error) {
			res.status(400).json({ success: false });
		}
		break;
	}

	default: {
		res.status(400).json({ success: false });
		break;
	}
	}
};

export default middlewares({ schema: BountySchema, handler });

