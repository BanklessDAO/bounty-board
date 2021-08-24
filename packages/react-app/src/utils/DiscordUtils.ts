import ServiceUtils from './ServiceUtils'

const BOUNTY_BOARD_URL = process.env.NEXT_PUBLIC_DAO_BOUNTY_BOARD_URL
const IN_PROGRESS_COLOR_YELLOW = 1998388
const END_OF_SEASON = process.env
  .NEXT_PUBLIC_DAO_CURRENT_SEASON_END_DATE as string

export default {
  generateBountyEmbedsMessage: (bounty: any): any => {
    return {
      embeds: [
        {
          title: bounty.title,
          url: BOUNTY_BOARD_URL + bounty._id,
          author: {
            icon_url: bounty.createdBy.url,
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
              value:
                bounty.reward.amount / 10 ** bounty.reward.scale +
                ' ' +
                bounty.reward.currency,
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
    }
  },
}
