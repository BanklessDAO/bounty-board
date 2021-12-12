import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import * as service from '../../../services/customer.service';
import { CustomerSchema } from '../../../models/Customer';
import validate from '../../../middlewares/validate';

export const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	await dbConnect();

	switch (req.method) {
	case 'GET': {
		try {
			const data = await service.getCustomers();
			res.status(200).json({ success: true, data });
		} catch (error) {
			res.status(400).json({ success: false });
		}
		break;
	}

	case 'POST': {
		try {
			const data = await service.createCustomer(req.body);
			res.status(201).json({ success: true, data });
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

export default validate({ schema: CustomerSchema, handler });