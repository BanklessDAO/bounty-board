import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import { BountySchema } from '../../../models/Bounty';
import validate from '../../../middlewares/validate';
import { internalServerError, notFound } from '../../../errors';
import * as service from '../../../services/bounty.service';

export const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {

	const { query: { id, key } } = req;
	if (typeof id !== 'string' || (key && typeof key !== 'string')) {
		return res.status(400).json({
			success: false,
			message: 'Multiple values for id and key are not supported',
			id,
			key,
		});
	}
	await dbConnect();

	const bounty = await service.getBounty(id as string);
	if (!bounty) {
		return notFound(res);
	}

	switch (req.method) {
	case 'GET':
		/* Get a model by its ID */
		res.status(200).json({ success: true, data: bounty });
		break;

	case 'PATCH' :
		/* Edit a model by its ID */
		try {
			const bountyIsEditable = service.canBeEdited({ bounty, key });
			if (!bountyIsEditable) {
				return res.status(400).json({
					success: false,
					message: 'Unable to edit bounty, either the edit key is invalid or it is not in an editable status',
					key,
					bountyStatus: bounty.status,
				});
			}
			const updateBounty = await service.editBounty({ bounty, body: req.body });
			res.status(200).json({ success: true, data: updateBounty });
		} catch (error) {
			internalServerError(res);
		}
		break;
		
	case 'DELETE':
		try {
			await service.deleteBounty(id as string);
			res.status(204).end();
		} catch (error) {
			res.status(400).json({ success: false, error });
		}
		break;

	default:
		return internalServerError(res);
	}
};

export default validate({ schema: BountySchema, handler });
