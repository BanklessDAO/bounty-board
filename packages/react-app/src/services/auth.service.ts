import { Role } from '@app/types/Role';
import * as discordService from './discord.service';
import { SessionWithToken } from '@app/types/SessionExtended';
import * as crypto from 'crypto';
import RoleCache, { IRoleCache } from '@app/models/RoleCache';
import { Document } from 'mongoose';
import { getCustomer } from '@app/services/customer.service';

export const FIVE_MINUTES = 5 * 60 * 1_000;

// base allowances to all users
export const baseRoles: Role[] = [
	'claim-bounties',
	'delete-own-bounty',
	'edit-own-bounty',
	'create-bounty',
];

/**
 * The auth service is aiming to wrap several other identity provdiers and
 * return a list of roles associated with the current user.
 * This can then be called by middlwares or directly in API endpoints
 */

export const getRolesForUserInGuild = async (
	accessToken: string,
	customerId: string
): Promise<string[]> => {
	/**
   * Get discord roleIds (numeric) for this user (accessToken) in this guild (customerId)
   */

	const discordUserStats = await discordService.getDiscordUserInGuild(
		accessToken,
		customerId
	);
	return discordUserStats.data.roles;
};

export const createSessionHash = (session: SessionWithToken): string => {
	// expires is regenerated every time but lasts for much longer than our cache
	const { user, accessToken } = session;
	const sessionString = JSON.stringify([user, accessToken]);
	return crypto.createHash('sha256').update(sessionString).digest('base64');
};

export const cacheExpired = (cache: IRoleCache): boolean => {
	return cache.createdAt + cache.tte <= new Date().getTime();
};

export const cacheValid = (cache: IRoleCache, sessionHash: string): boolean => {
	const notExpired = !cacheExpired(cache);
	const unchangedSessionHash = sessionHash === cache.sessionHash;
	return notExpired && unchangedSessionHash;
};

export const generateCacheObject = (
	sessionHash: string,
	roles: Role[],
	customerId: string
): IRoleCache => ({
	createdAt: new Date().getTime(),
	roles,
	sessionHash,
	customerId,
	tte: FIVE_MINUTES,
});

type CreateCacheProps = {
  cache: Document<IRoleCache> | null;
  sessionHash: string;
  token: string;
  customerId: string;
};

export const createCache = async ({
	cache,
	sessionHash,
	token,
	customerId,
}: CreateCacheProps): Promise<IRoleCache> => {
	await cache?.remove();
	const roles = await getPermissions(token, customerId);
	const newCache = generateCacheObject(sessionHash, roles, customerId);
	await RoleCache.create(newCache);
	return newCache;
};

export const getPermissions = async (
	accessToken: string,
	customerId: string
): Promise<Role[]> => {
	/**
   * Returns a list of permissions (aka roles) for the current user's external roles.
   * Uses the external roles => permissions (roles) mapping in the customer record.
   */

	const customer = await getCustomer(customerId);

	// Customer doesn't exist
	if (!customer) {
		return [];
	}

	// Customer has no roles defined
	if (!customer.externalRoleMap) {
		return [];
	}

	const externalRolesForUser = await getRolesForUserInGuild(
		accessToken,
		customerId
	);

	if (customer.externalRoleMap.adminExternalRoles) {
		// All roles for this customer are admin
		if (customer.externalRoleMap.adminExternalRoles[0] == '*') {
			return ['admin'];
		}
		// User has an external role listed in our admin group
		if (
			externalRolesForUser.filter((exRole) =>
				customer.externalRoleMap?.adminExternalRoles?.includes(exRole)
			).length > 0
		) {
			return ['admin'];
		}
	}

	const roles: Role[] = [];

	if (customer.externalRoleMap.baseExternalRoles) {
		// User has an external role that covers the base roles
		if (
			externalRolesForUser.filter((exRole) =>
				customer.externalRoleMap?.baseExternalRoles?.includes(exRole)
			).length > 0
		) {
			roles.push(...baseRoles);
		}
	}

	if (customer.externalRoleMap.customExternalRoleMap) {
		// Get the list of roles from the custom map
		customer.externalRoleMap.customExternalRoleMap.forEach((map) => {
			if (externalRolesForUser.includes(map.externalRole)) {
				roles.push(...map.roles);
			}
		});
	}

	return roles;
};

export const getPermissionsCached = async (
	session: SessionWithToken,
	customerId: string,
	flush = true
): Promise<Role[]> => {
	if (flush) flushCache();
	if (customerId === 'undefined') {
		throw Error('Passed a string of "undefined" as the customer ID');
	}
	const sessionHash = createSessionHash(session);
	const cache = await RoleCache.findOne({ sessionHash, customerId });
	if (cache && cacheValid(cache, sessionHash)) {
		return cache.roles;
	} else {
		const newCache = await createCache({
			cache,
			sessionHash,
			token: session.accessToken,
			customerId,
		});
		return newCache.roles;
	}
};

const flushCache = async (): Promise<void> => {
	/**
   * Periodically call to remove records older than 10 minutes.
   * Keep as synchronous method in order not to impact performance
   */
	const TenMinsAgo = new Date().getTime() - 2 * FIVE_MINUTES;
	await RoleCache.deleteMany({ createdAt: { $lte: TenMinsAgo } });
};
