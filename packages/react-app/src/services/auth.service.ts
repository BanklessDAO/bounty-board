import { BANKLESS } from '@app/constants/Bankless';
import { BANKLESS_ROLE_IDS } from '@app/constants/Roles';
import { Role } from '@app/types/Role';
import { Session } from 'next-auth';
import * as discordService from './discord.service';

const roleIds = Object.keys(BANKLESS_ROLE_IDS);

export const getPermissions = async (session: Session, customer_id: string): Promise<Role[]> => {
	/**
   * Returns a list of permissions for the current user
   * We currently only support the `bounty-create` role, for discord level 2s in bankless DAO
   */
	if (customer_id !== BANKLESS.customer_id) return [];
	const banklessRolesForUser = await getRolesForUserInGuild(session, customer_id);
	return banklessRolesForUser.includes('level-2') ? ['create-bounty'] : [];
};


export const discordRoleIdsToNamedRoles = (discordRoleIds: string[]): string[] => {
	/**
    * Discord role ids are strings of numbers, we want to transform them to something
    * readable until we can fetch the roles directly
    * NOTE: this only fetches the roles where we have provided role ids in BANKLESS_ROLE_IDS
    */
	return discordRoleIds
		.filter((role: string) => roleIds.includes(role))
		.map((role: string) => BANKLESS_ROLE_IDS[role]);
};

export const getRolesForUserInGuild = async (
	session: Session,
	customer_id: string
): Promise<string[]> => {
	/**
    * Get discord roleIds (numeric) from the API then return named roles
    */
	const discordUserStats = await discordService.getDiscordUserInGuild(session, customer_id);
	return discordRoleIdsToNamedRoles(discordUserStats.data.roles);
};