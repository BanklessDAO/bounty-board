import { internalServerError } from '@app/errors';
import { RoleRestrictions } from '@app/types/Role';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

type RouteFunction = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

const isTest = process.env.TESTING === 'true';

const isRestrictedMethod = (method: string, roleRestrictions: RoleRestrictions): boolean => {
	/**
	 * Passing a roleRestrictions object allows us to, on a per-handler basis
	 * Set restricted routes, and their corresponding roles.
	 * This function checks if the handler has defined one of the supported HTTP methods
	 * as 'restricted'
	 */
	const restrictedMethods = Object.keys(roleRestrictions);
	return restrictedMethods.includes(method);
};

const isAuthorized = async (req: NextApiRequest): Promise<boolean> => {
	/**
	 * The initial logic for this was in the comments below, however
	 * we hit discord API rate limits, so for now we are just allowing POST Requests
	 */
	// , roleRestrictions: RoleRestrictions, res: NextApiResponse	
	// const userRoles = await getRolesForUser(req, res) ?? []
	// const whiteListedRolesForRoute = roleRestrictions[req.method as SupportedHTTPMethods] ?? [];
	// return whiteListedRolesForRoute.some(r => userRoles.includes(r));
	
	return req.method === 'POST';
};

/**
 * Restricts supported routes to those with the correct roles
 * @param restrictions allows you to pass in a k/v mapping of method to [roles], for a given routet
 * @returns 
 */
export default (handler: NextApiHandler, restrictions?: RoleRestrictions): RouteFunction => {
	return async (req: NextApiRequest, res: NextApiResponse) => {
		const method = req.method ?? 'GET';
		if (!isTest && restrictions && isRestrictedMethod(method, restrictions)) {
			try {
				const authorized = await isAuthorized(req);
				if (authorized) {
					await handler(req, res);
				} else {
					res.status(403).json({ success: false, error: 'Unauthorized' });
				}
			} catch (error) {
				internalServerError(res);
			}
		} else {
			await handler(req, res);
		}
	};
};

