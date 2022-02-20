import { BANKLESS_ROLES } from '@app/constants/Roles';
import { Role } from '@app/types/Role';
import * as discordService from './discord.service';
import { SessionWithToken } from '@app/types/SessionExtended';
import * as crypto from 'crypto';
import RoleCache, { IRoleCache } from '@app/models/RoleCache';
import { Document } from 'mongoose';
import { BANKLESS } from '@app/constants/Bankless';

export const FIVE_MINUTES = 5 * 60 * 1_000;
const ROLE_IDS = Object.values(BANKLESS_ROLES);

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
    * Get discord roleIds (numeric) then filter to only roles that are supported
	* By the application
    */
	// currently only supports bankless
	if (customerId !== BANKLESS.customer_id) {
		return [];
	}
	const discordUserStats = await discordService.getDiscordUserInGuild(accessToken, customerId);
	return discordUserStats.data.roles.filter(role => ROLE_IDS.includes(role));
};

export const createSessionHash = (session: SessionWithToken): string => {
	// expires is regenerated every time but lasts for much longer than our cache
	const { user, accessToken } = session;
	const sessionString = JSON.stringify([user, accessToken]);
	return crypto
		.createHash('sha256')
		.update(sessionString)
		.digest('base64');
};

export const cacheExpired = (cache: IRoleCache): boolean => {
	return cache.createdAt + cache.tte <= new Date().getTime();
};

export const cacheValid = (cache: IRoleCache, sessionHash: string): boolean => {
	const notExpired = !cacheExpired(cache);
	const unchangedSessionHash = sessionHash === cache.sessionHash;
	return notExpired && unchangedSessionHash;
};

export const generateCacheObject = (sessionHash: string, roles: Role[], customerId: string): IRoleCache => ({
	createdAt: new Date().getTime(),
	roles,
	sessionHash,
	customerId,
	tte: FIVE_MINUTES,
});

type CreateCacheProps = {
	cache: Document<IRoleCache> | null,
	sessionHash: string,
	token: string,
	customerId: string,
}

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

export const getPermissions = async (accessToken: string, customerId: string): Promise<Role[]> => {
	/**
   * Returns a list of permissions for the current user
   * We currently only support the `bounty-create` role, for discord level 1 - 4s in bankless DAO
   */
	// note: only currently supports bankless
	const banklessRolesForUser = await getRolesForUserInGuild(accessToken, customerId);
	const permissions: Role[] = [];
	if (
		banklessRolesForUser.includes(BANKLESS_ROLES.LEVEL_4) ||
		banklessRolesForUser.includes(BANKLESS_ROLES.LEVEL_3) ||
		banklessRolesForUser.includes(BANKLESS_ROLES.LEVEL_2) ||
		banklessRolesForUser.includes(BANKLESS_ROLES.LEVEL_1)
	) permissions.push('create-bounty', 'claim-bounties');

	if (banklessRolesForUser.includes(BANKLESS_ROLES.BB_CORE)) permissions.push('admin');

	
	return permissions;
};

export const getPermissionsCached = async (session: SessionWithToken, customerId: string, flush = true): Promise<Role[]> => {
	if (flush) flushCache();
	const sessionHash = createSessionHash(session);
	const cache = await RoleCache.findOne({ sessionHash, customerId });
	if (cache && cacheValid(cache, sessionHash)) {
		return cache.roles;
	} else {
		const newCache = await createCache({ cache, sessionHash, token: session.accessToken, customerId });
		return newCache.roles;
	}
};

const flushCache = async (): Promise<void> => {
	/**
	 * Periodically call to remove records older than 10 minutes.
	 * Keep as synchronous method in order not to impact performance
	 */
	const TenMinsAgo = new Date().getTime() - (2 * FIVE_MINUTES);
	await RoleCache.deleteMany({ createdAt: { $lte: TenMinsAgo } });
};