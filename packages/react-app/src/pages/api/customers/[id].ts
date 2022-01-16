import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import * as service from '../../../services/customer.service';
import { internalServerError, notFound } from '../../../errors';
import { CustomerSchema } from '../../../models/Customer';
import middlewares from '../../../middlewares';

export const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {

	const { id } = req.query;
	if (typeof id !== 'string') {
		return res.status(400).json({
			success: false,
			message: 'Multiple values for id are not supported',
			id,
		});
	}

	await dbConnect();

	const customer = await service.getCustomer(id);
	if (!customer) {
		return notFound(res);
	}

	switch (req.method) {
	case 'GET': {
		res.status(200).json({ success: true, data: customer });
		break;
	}

	case 'PUT': {
		try {
			const editedCustomer = await service.editCustomer({ customer, body: req.body });
			res.status(201).json({ success: true, data: editedCustomer });
		} catch (error) {
			res.status(400).json({ success: false, error });
		}
		break;
	}

	case 'DELETE': {
		try {
			await service.deleteCustomer(id);
			res.status(204).end();
		} catch (error) {
			res.status(400).json({ success: false, error });
		}
		break;
	}

	default: {
		internalServerError(res);
		break;
	}
	}
};

export default middlewares({ schema: CustomerSchema, handler });
