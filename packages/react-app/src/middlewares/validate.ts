import { RoleRestrictions } from '@app/types/Role';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { OptionalObjectSchema, ObjectShape } from 'yup/lib/object';
import MiscUtils from '../utils/miscUtils';

type ValidatorFunction = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
export type ValidatorProps = {
  schema: OptionalObjectSchema<ObjectShape>,
  handler: NextApiHandler,
	restrictions?: RoleRestrictions
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
		return { error: err };
	}
};

/**
 * Generic validation middleware that can we used to wrap all routes.
 * 
 * These must be defined as a yup schema object. You can then wrap routes
 * in the exported function below.
 * 
 * "force=true" in the req query string will bypass validation
 * *
 * @param schema is the yup schema object to validate against 
 * @param handler is the next route handler
 */
const validate = ({ schema, handler }: ValidatorProps): ValidatorFunction => {
	return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
		if (!MiscUtils.boolFromReq(req, 'force')) {
			try {
				if (req.method && ['POST', 'PATCH', 'PUT'].includes(req.method)) {
					if (checkIsEmpty(req)) {
						return res
							.status(400)
							.json({ error: 'Request cannot have an empty body' });
					}
					req.body = await schema.validate(req.body, {
						strict: true,
						abortEarly: false,
						context: { method: req.method },
					});
				}
			} catch (err: any) {
				err.errors.forEach((element: any) => {
					console.log(element);
				});
				const _json = handleErrResponse(err);
				return res.status(400).json(_json);
			}
		}
		await handler(req, res);
	};
};

export default validate;
