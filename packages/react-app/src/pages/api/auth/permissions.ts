import { internalServerError } from '../../../errors';
import { NextApiRequest, NextApiResponse } from 'next';
import * as service from '../../../services/auth.service';


const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	const { method } = req;

	switch (method) {
	case 'GET':
		try {
      const permissions = service.getPermissions();
			res.status(200).json({ success: true, data: permissions });
		} catch (error) {
			res.status(400).json({ success: false, error });
		}
		break;

	default:
    internalServerError(res);
    break;
	}
};

export default handler;

