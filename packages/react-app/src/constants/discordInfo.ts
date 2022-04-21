const discordInfo = {
	baseUrl: 'https://discord.com/channels',
};
export const baseUrl = 'https://discord.com/channels';
const supportChannelId = process.env.BOUNTY_BOARD_DISCORD_SUPPORT_CHANNEL || '834499078434979893';
const supportServerId = process.env.BOUNTY_BOARD_DISCORD_SUPPORT_SERVER || '834499078434979890';

export const discordSupportChannelUrl = `${discordInfo.baseUrl}/${supportServerId}/${supportChannelId}`;
export const feedbackUrl = process.env.FEEDBACK_URL || 'https://tally.so/r/n0GD0w';

