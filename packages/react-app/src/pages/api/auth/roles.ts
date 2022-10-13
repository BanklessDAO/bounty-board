import * as service from '@app/services/auth.service';
import { SessionWithToken } from '@app/types/SessionExtended';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	switch (req.method) {
	case 'GET': {
		try {
			const session = await getSession({ req });
			const { customerId } = req.query;
			if (!customerId || typeof customerId !== 'string') {
				return res.status(400).json({
					success: false,
					error: 'Missing customer Id field or specified multiple',
				});
			}
			if (session && session.accessToken) {
				const roles = await service.getPermissionsCached(
            session as SessionWithToken,
            customerId as string
				);
				res.status(200).json({
					success: true,
					data: {
						roles,
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
