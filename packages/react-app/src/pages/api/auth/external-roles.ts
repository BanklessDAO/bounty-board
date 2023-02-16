import * as service from '@app/services/auth.service';
import { SessionWithToken } from '@app/types/SessionExtended';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

// Get the external (i.e. Discord) roles for the user in the given customer/guild.

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	switch (req.method) {
	case 'GET': {
		try {
			const session = (await getSession({ req })) as SessionWithToken;
			const { customerId } = req.query;
			if (!customerId || typeof customerId !== 'string') {
				return res.status(400).json({
					success: false,
					error: 'Missing customer Id field or specified multiple',
				});
			}
			if (session && session.accessToken) {
				const externalRoles = await service.getRolesForUserInGuild(
					session.accessToken,
					customerId
				);
				res.status(200).json({
					success: true,
					data: {
						externalRoles,
					},
				});
			} else {
				res.status(200).json({
					success: 200,
					data: {
						roles: [],
						notes: 'No session found',
					},
				});
			}
		} catch (error: any) {
			res
				.status(error.status ?? 400)
				.json({ success: false, error: error?.response?.statusText });
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
