import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import { BountySchema } from '../../../models/Bounty';
import validate from '../../../middlewares/validate';
import { internalServerError, notFound } from '../../../errors';
import * as service from '../../../services/bounty.service';

const validateStringInputs = (req: NextApiRequest, res: NextApiResponse): [string, string] => {
	/**
	 * Next allows for multiple values to be passed for a single query param in the
	 * @param req object, this is a guard clause to reject the request if so
	 * Also allows safe typecasting
	 */
	const { query: { id, key } } = req;
	// if (typeof id !== 'string' || typeof key !== 'string') {
	// 	res.status(400).json({
	// 		success: false,
	// 		message: 'Multiple values for id and key are not supported',
	// 		id,
	// 		key,
	// 	});
	// }
	return [id, key] as [string, string];
};

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {

	const [id, key] = validateStringInputs(req, res);

	await dbConnect();

	switch (req.method) {
	case 'GET':
		/* Get a model by its ID */
		try {
			const bounty = await service.getBounty(id);
			if (!bounty) {
				return notFound(res);
			}
			res.status(200).json({ success: true, data: bounty });
		} catch (error) {
			internalServerError(res);
		}
		break;

	case 'PUT' :
		/* Edit a model by its ID */
		try {
			const bounty = await service.getBounty(id);
			if (!bounty) {
				return notFound(res);
			}
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
			const bounty = await service.getBounty(id as string);
			if (!bounty) {
				return notFound(res);
			}
			await service.deleteBounty(id as string);
			res.status(204).json({ success: true, message: 'Bounty deleted' });
		} catch (error) {
			res.status(400).json({ success: false, error });
		}
		break;

	default:
		internalServerError(res);
	}
};

export default validate({ schema: BountySchema, handler });
