import { BANKLESS_ROLES } from '@app/constants/Roles';
import { Role } from '@app/types/Role';
import * as discordService from './discord.service';

/**
 * The auth service is aiming to wrap several other identity provdiers and
 * return a list of roles associated with the current user.
 * This can then be called by middlwares or directly in API endpoints
 */

const ROLE_IDS = Object.values(BANKLESS_ROLES);

export const getPermissions = async (accessToken: string): Promise<Role[]> => {
	/**
   * Returns a list of permissions for the current user
   * We currently only support the `bounty-create` role, for discord level 2s in bankless DAO
   */
	// note: only currently supports bankless
	const banklessRolesForUser = await getRolesForUserInGuild(accessToken);
	const permissions: Role[] = [];
	console.debug({ banklessRolesForUser, ROLE_IDS });
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
	console.debug(discordUserStats.data.roles);
	return discordUserStats.data.roles.filter(role => ROLE_IDS.includes(role));
};