import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import * as service from '../../../services/savedUserQuery.service';
import middlewares from '../../../middlewares';
import { SavedUserQuerySchema } from '@app/models/SavedUserQuery';

export const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	await dbConnect();

	switch (req.method) {
	case 'GET': {
		try {
			const data = await service.getQueriesByDiscordId(req.query);
			res.status(200).json({ success: true, data });
		} catch (error) {
			res.status(400).json({ success: false });
		}
		break;
	}

	case 'POST': {
		const currentTime = new Date().valueOf();
		try {
			const data = await service.addQuery({ ...req.body, createdAt: currentTime, updatedAt: currentTime });
			res.status(201).json({ success: true, data });
		} catch (error) {
			res.status(400).json({ success: false });
		}
		break;
	}

	case 'DELETE': {
		try {
			await service.deleteSingleQuery(req.query.id as string);
			res.status(204).json({ success: true });
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

export default middlewares({ schema: SavedUserQuerySchema, handler });