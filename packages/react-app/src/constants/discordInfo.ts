const discordInfo = {
  baseUrl: 'https://discord.com/channels',
  server: process.env.NEXT_PUBLIC_DISCORD_SERVER_ID,
  channel: process.env.NEXT_PUBLIC_DISCORD_CHANNEL_BOUNTY_BOARD_ID,
}

export const discordChannelUrl = `${discordInfo.baseUrl}/${discordInfo.server}/${discordInfo.channel}`

export default discordInfo
