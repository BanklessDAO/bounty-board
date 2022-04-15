import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@app/utils/dbConnect';
import { BountyClaimSchema } from '@app/models/Bounty';
import { internalServerError, notFound } from '@app/errors';
import * as service from '@app/services/bounty.service';
import middlewares from '@app/middlewares';
import { RoleRestrictions } from '@app/types/Role';

const restrictions: RoleRestrictions = {
	PATCH: ['admin', 'claim-bounties'],
};

export const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {

	const { query: { id } } = req;
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

	console.debug('In Claim handler');

	switch (req.method) {

	case 'PATCH':
		/* Edit a model by its ID */
		try {
			const bountyIsEditable = service.canBeEdited({ bounty });
			if (!bountyIsEditable) {
				return res.status(400).json({
					success: false,
					message: 'Unable to edit bounty, as is not in an editable status',
					bountyStatus: bounty.status,
				});
			}
			const updateBounty = await service.editBounty({ bounty, body: req.body });
			res.status(200).json({ success: true, data: updateBounty });
		} catch (error) {
			internalServerError(res);
		}
		break;

	default:
		return internalServerError(res);
	}
};

export default middlewares({ schema: BountyClaimSchema, handler, restrictions });
