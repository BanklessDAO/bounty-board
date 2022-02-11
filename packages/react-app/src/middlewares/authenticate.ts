import { internalServerError } from '@app/errors';
import { getPermissionsCached } from '@app/services/auth.service';
import { RoleRestrictions, SupportedHTTPMethods } from '@app/types/Role';
import { SessionWithToken } from '@app/types/SessionExtended';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

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

type AuthResponse = {
	success: boolean,
	error?: string;
}

const isAuthorized = async (
	req: NextApiRequest,
	roleRestrictions: RoleRestrictions,
	customerId: string | string[] | undefined,
): Promise<AuthResponse> => {
	/**
	 * The initial logic for this was in the comments below, however
	 * we hit discord API rate limits, so for now we are just allowing POST Requests
	 */
	const session = await getSession({ req });
	if (typeof customerId !== 'string') {
		return {
			success: false,
			error: 'Missing customer Id field or specified multiple',
		};
	}
	if (session && session.accessToken) {
		const userRoles = await getPermissionsCached(session as SessionWithToken, customerId);
		const whiteListedRolesForRoute = roleRestrictions[req.method as SupportedHTTPMethods] ?? [];
		const rolesIncluded = whiteListedRolesForRoute.some(r => userRoles.includes(r));
		if (rolesIncluded) {
			return {
				success: true,
			};
		} else {
			return {
				success: false,
				error: 'Unauthorized',
			};
		}
	} else {
		return {
			success: false,
			error: 'Missing session or access token',
		};
	}
};

/**
 * Restricts supported routes to those with the correct roles
 * @param restrictions allows you to pass in a k/v mapping of method to [roles], for a given routet
 * @returns 
 */
export default (handler: NextApiHandler, restrictions?: RoleRestrictions): RouteFunction => {
	return async (req: NextApiRequest, res: NextApiResponse) => {
		const method = req.method ?? 'GET';
		const { query: { customerId } } = req;
		if (!isTest && restrictions && isRestrictedMethod(method, restrictions)) {
			try {
				const authorized = await isAuthorized(req, restrictions, customerId);
				if (authorized.success) {
					await handler(req, res);
				} else {
					res.status(403).json(authorized);
				}
			} catch (error) {
				internalServerError(res);
			}
		} else {
			await handler(req, res);
		}
	};
};

