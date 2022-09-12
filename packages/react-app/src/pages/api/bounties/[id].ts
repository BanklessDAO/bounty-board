import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import { BountySchema } from '../../../models/Bounty';
import { internalServerError, notFound } from '../../../errors';
import * as service from '../../../services/bounty.service';
import middlewares from '../../../middlewares';
import { RoleRestrictions } from '@app/types/Role';
import MiscUtils from '../../../utils/miscUtils';
import ServiceUtils from '../../../utils/ServiceUtils';

const restrictions: RoleRestrictions = {
	PATCH: ['admin', 'edit-bounties', 'edit-own-bounty'],
	DELETE: ['admin', 'delete-bounties', 'delete-own-bounty'],
};

export const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	const {
		query: { id },
	} = req;

	const forceUpdate = MiscUtils.boolFromReq(req, 'force');

	if (typeof id !== 'string') {
		return res.status(400).json({
			success: false,
			message: 'Multiple values for id are not supported',
			id,
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

	case 'PATCH':
		/* Edit a model by its ID */
		try {
			if (!forceUpdate) {
				const bountyIsEditable = ServiceUtils.canBeEdited({ bounty });
				if (!bountyIsEditable) {
					return res.status(400).json({
						success: false,
						message: 'Unable to edit bounty, as is not in an editable status',
						bountyStatus: bounty.status,
					});
				}
			}
			const updateBounty = await service.editBounty({
				bounty,
				body: req.body,
			});
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

export default middlewares({ schema: BountySchema, handler, restrictions });
