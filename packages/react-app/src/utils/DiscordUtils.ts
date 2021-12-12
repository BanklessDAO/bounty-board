import ServiceUtils from './ServiceUtils';
import { BountyCollection } from '../types/BountyCollection';

const BOUNTY_BOARD_URL = process.env.NEXT_PUBLIC_DAO_BOUNTY_BOARD_URL || '';
const IN_PROGRESS_COLOR_YELLOW = 1998388;
const END_OF_SEASON = process.env.NEXT_PUBLIC_DAO_CURRENT_SEASON_END_DATE as string;

export default {
	generateBountyEmbedsMessage: (bounty: BountyCollection): any => {
		return {
			embeds: [
				{
					title: bounty.title,
					url: BOUNTY_BOARD_URL + bounty._id,
					author: {
						icon_url: bounty.createdBy.iconUrl,
						name: bounty.createdBy.discordHandle,
					},
					description: bounty.description,
					color: IN_PROGRESS_COLOR_YELLOW,
					fields: [
						{
							name: 'HashId',
							value: bounty._id,
						},
						{
							name: 'Criteria',
							value: bounty.criteria,
						},
						{
							name: 'Reward',
							value: bounty.reward.amount.valueOf() + ' ' + bounty.reward.currency,
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
		};
	},
};
