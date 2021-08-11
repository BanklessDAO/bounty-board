const discordInfo = {
  baseUrl: 'https://discord.com/channels',
  server: process.env.NEXT_PUBLIC_DISCORD_SERVER_ID,
  channel: process.env.NEXT_PUBLIC_DISCORD_CHANNEL_BOUNTY_BOARD_ID,
}

export const discordChannelUrl = `${discordInfo.baseUrl}/${discordInfo.server}/${discordInfo.channel}`

export const discordSupportChannelUrl = "https://discord.com/channels/834499078434979890/834499078434979893"
export const feedbackUrl = "https://forms.gle/NhTrynZ8pkkepHzN8"

export default discordInfo