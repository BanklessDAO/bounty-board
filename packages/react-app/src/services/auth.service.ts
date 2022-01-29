import { BANKLESS_ROLES } from '@app/constants/Roles';
import { Role } from '@app/types/Role';
import * as discordService from './discord.service';
import { SessionWithToken } from '@app/types/SessionExtended';
import * as crypto from 'crypto';
import RoleCache, { IRoleCache } from '@app/models/RoleCache';
import { Document } from 'mongoose';

export const FIVE_MINUTES = 5 * 60 * 1_000;
const ROLE_IDS = Object.values(BANKLESS_ROLES);

/**
 * The auth service is aiming to wrap several other identity provdiers and
 * return a list of roles associated with the current user.
 * This can then be called by middlwares or directly in API endpoints
 */

export const getPermissions = async (accessToken: string): Promise<Role[]> => {
	/**
   * Returns a list of permissions for the current user
   * We currently only support the `bounty-create` role, for discord level 2s in bankless DAO
   */
	// note: only currently supports bankless
	const banklessRolesForUser = await getRolesForUserInGuild(accessToken);
	const permissions: Role[] = [];
	if (banklessRolesForUser.includes(BANKLESS_ROLES.LEVEL_2)) permissions.push('create-bounty');
	if (banklessRolesForUser.includes(BANKLESS_ROLES.BB_CORE)) permissions.push('admin');
	return permissions;
};

export const getRolesForUserInGuild = async (
	accessToken: string
): Promise<string[]> => {
	/**
    * Get discord roleIds (numeric) then filter to only roles that are supported
		* By the application
    */
	// currently only supports bankless
	const discordUserStats = await discordService.getDiscordUserInGuild(accessToken);
	return discordUserStats.data.roles.filter(role => ROLE_IDS.includes(role));
};

export const createSessionHash = (session: SessionWithToken): string => {
	// expires is regenerated every time but lasts for much longer than our cache
	const { expires, ...invariants } = session; expires;
	const sessionString = JSON.stringify(invariants);
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

export const generateCacheObject = (sessionHash: string, roles: Role[]): IRoleCache => ({
	createdAt: new Date().getTime(),
	roles,
	sessionHash,
	tte: FIVE_MINUTES,
});

export const createCache = async (
	cache: Document<IRoleCache> | null,
	sessionHash: string,
	token: string
): Promise<IRoleCache> => {
	await cache?.remove();
	const roles = await getPermissions(token);
	const newCache = generateCacheObject(sessionHash, roles);
	await RoleCache.create(newCache);
	return newCache;
};

export const getPermissionsCached = async (session: SessionWithToken, flush = true): Promise<Role[]> => {
	if (flush) flushCache();
	const sessionHash = createSessionHash(session);
	const cache = await RoleCache.findOne({ sessionHash });
	if (cache && cacheValid(cache, sessionHash)) {
		return cache.roles;
	} else {
		const newCache = await createCache(cache, sessionHash, session.accessToken);
		return newCache.roles;
	}
};

const flushCache = async (): Promise<void> => {
	/**
	 * Periodically call to remove records older than 5 minutes.
	 * Keep as synchronous method in order not to impact performance
	 */
	const TenMinsAgo = new Date().getTime() - (2 * FIVE_MINUTES);
	await RoleCache.deleteMany({ createdAt: { $lte: TenMinsAgo } });
};