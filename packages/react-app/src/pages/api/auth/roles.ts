import * as service from '@app/services/auth.service';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {

	switch (req.method) {
	case 'GET': {
		try {
			const { customer_id } = req.query;
			if (!customer_id || typeof customer_id !== 'string') {
				res.status(400).json({ success: false, error: 'Missing single customer_id field' });
			}

			const session = await getSession({ req });
			if (!session) {
				res.status(401).json({ success: false, error: 'No session found' });
			}

			const roles = await service.getPermissions(session as Session, customer_id as string);
			console.debug({ rolesAPI: roles });
			res.status(200).json({ success: true, data: roles });

		} catch (error) {
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

