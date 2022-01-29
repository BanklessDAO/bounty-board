import { signIn, signOut } from 'next-auth/react';
import { DiscordEmbed } from '../types/Discord';
import { BountyCollection } from '../models/Bounty';
import axios from '../utils/AxiosUtils';
import ServiceUtils from '../utils/ServiceUtils';
import { APIGuildMember } from 'discord-api-types';
import { AxiosResponse } from 'axios';
import { BANKLESS } from '@app/constants/Bankless';
import { SessionWithToken } from '@app/types/SessionExtended';
import { Session } from 'next-auth';

const BOUNTY_BOARD_URL = process.env.NEXT_PUBLIC_DAO_BOUNTY_BOARD_URL || '';
const IN_PROGRESS_COLOR_YELLOW = 1998388;
const END_OF_SEASON = process.env.NEXT_PUBLIC_DAO_CURRENT_SEASON_END_DATE as string;

export const getDiscordUserInGuild = async (
	accessToken?: string,
): Promise<AxiosResponse<APIGuildMember, any>> => {
	/**
	 * Fetches detailed information from discord about a user's guild stats
	 * @param session is the next auth session
	 * At the moment, we currently only support the bankless DAO for role gating
	 * 
	 * This function reaches out to the discord API and unfortunately seems to have an aggressive
	 * rate limiting. This means that relying on it can make the application very brittle. We should
	 * instead be looking to cache the response or find an alternative auth mechanism or endpoint
	 */
	return await axios.get<APIGuildMember>(`https://discord.com/api/users/@me/guilds/${BANKLESS.customer_id}/member`, 	{
		headers: {
			authorization: `Bearer ${accessToken}`,
		},
	});
};

export const toggleDiscordSignIn = (
	session: SessionWithToken | Session | unknown,
): void => {
	/**
   * @param session is whether the user is logged in.
   *  If so: log the user out
   *  If not: sign in and get/set the list of available DAOs for the selcto
   */
	if (session) {
		signOut();
	} else {
		signIn('discord' as any);
	}
};

export const publishBountyToDiscordChannel = async (
	bounty: BountyCollection,
	previousStatus: string
): Promise<any> => {

	const { DISCORD_BOUNTY_BOARD_WEBHOOK } = process.env;
	
	if (!DISCORD_BOUNTY_BOARD_WEBHOOK) {
		console.warn('Attempting to edit bounties without a discord webhook set, users will not be notified of changes - please ensure the DISCORD_BOUNTY_BOARD_WEBHOOK is correctly set');
		return;
	}

	if (previousStatus.toLowerCase() !== 'draft') {
		return;
	}

	const embedMessage = generateBountyEmbedsMessage(bounty);
	try {
		const response = await axios.post(DISCORD_BOUNTY_BOARD_WEBHOOK + '?wait=true', {
			data: {
				embedMessage,
			},
		});
		console.log(response);
	} catch (error) {
		// to do: pass to sentry
		console.warn(error);
	}
};

export const rewardValue = (reward: BountyCollection['reward']): string => {
	/**
	 * Construct a runtime safe reward
	 */
	const { amount, currency, scale } = reward;
	return ((amount ?? 0).valueOf() / (10 ** (scale ?? 0).valueOf())) + ' ' + (currency ?? 'BANK');
};

/**
 * Creates the required bounty message to integrate with discord
 * @TODO check if there is an off-the-shelf api typing for the return object
 */
export const generateBountyEmbedsMessage = (bounty: BountyCollection): DiscordEmbed => ({
	embeds: [
		{
			title: bounty.title,
			url: BOUNTY_BOARD_URL + bounty._id,
			author: {
				name: bounty.createdBy.discordHandle,
			},
			description: bounty.description,
			color: IN_PROGRESS_COLOR_YELLOW,
			fields: [
				{
					name: 'HashId',
					value: bounty._id as string,
				},
				{
					name: 'Criteria',
					value: bounty.criteria,
				},
				{
					name: 'Reward',
					value: rewardValue(bounty.reward),
					inline: true,
				},
				{
					name: 'Status',
					value: bounty.status,
					inline: true,
				},
				{
					name: 'Deadline',
					value: ServiceUtils.formatDisplayDate(END_OF_SEASON),
					inline: true,
				},
				{
					name: 'Created By',
					value: bounty.createdBy.discordHandle,
					inline: true,
				},
			],
			timestamp: new Date().toISOString(),
			footer: {
				text: '🔄 - refresh | 🏴 - start | 📝 - edit | ❌ - delete',
			},
		},
	],
});