import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { OptionalObjectSchema, ObjectShape } from 'yup/lib/object';

type ValidatorFunction = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
type ValidatorProps = {
  schema: OptionalObjectSchema<ObjectShape>,
  handler: NextApiHandler,
};

const has = (object: unknown, key: string) => object ? Object.prototype.hasOwnProperty.call(object, key) : false;

const checkIsEmpty = (req: NextApiRequest) => !req.body || Object.entries(req.body).length === 0;

const handleErrResponse = (err: unknown): Record<string, unknown> => {
	/**
   * Runtime property checking of unknown error type, inspired by lodash
   */
	if (has(err, 'message') && has(err, 'errors')) {
		const { message, errors } = err as { message: string, errors: string[] };
		return { message, errors };
	} else {
		return { err };
	}
};

/**
 * Generic validation middleware that can we used to wrap all routes.
 * Currently checks validation schema for POST PATCH PUT methods.
 * 
 * These must be defined as a yup schema object. You can then wrap routes
 * in the exported function below.
 * 
 * 
 * @param schema is the yup schema object to validate against 
 * @param handler is the next route handler
 */
const validate = ({ schema, handler }: ValidatorProps): ValidatorFunction => {
	return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
		if (checkIsEmpty(req)) {
			return res
				.status(400)
				.json({ error: 'Request cannot have an empty body' });
		};
		try {
			if (req.method && req.method === 'POST') {
				req.body = await schema.validate(req.body, {
					stripUnknown: false,
					abortEarly: false,
					context: { method: req.method }
				});
			} else if (req.method && req.method === 'PUT') {
				console.debug(req.method);
				req.body = await schema.validate(req.body, {
					stripUnknown: false,
					abortEarly: false,
					context: { method: req.method }
				});
			}
		} catch (err: any) {
			const _json = handleErrResponse(err);
			return res.status(400).json(_json);
		}
		await handler(req, res);
	};
};

export default validate;
