const discordInfo = {
	baseUrl: 'https://discord.com/channels',
	server: process.env.NEXT_PUBLIC_DISCORD_SERVER_ID,
	channel: process.env.NEXT_PUBLIC_DISCORD_CHANNEL_BOUNTY_BOARD_ID,
};
export const baseUrl = 'https://discord.com/channels';
const supportChannelId = '834499078434979893';
const serverId = '834499078434979890';
// separation of concerns: discordInfo.server (bountyboard) vs serverId (support)
// discordInfo.server will likely never change. ServerId may change

export const discordChannelUrl = `${discordInfo.baseUrl}/${discordInfo.server}/${discordInfo.channel}`;

export const discordSupportChannelUrl = `${discordInfo.baseUrl}/${serverId}/${supportChannelId}`;
export const feedbackUrl = 'https://forms.gle/NhTrynZ8pkkepHzN8';

