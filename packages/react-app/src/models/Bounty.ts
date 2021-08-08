import mongoose from 'mongoose'

/* Global typing for Bounties */
export type BountyBoardProps = {
  _id: any
  season?: number
  title: string
  description: string
  criteria: string
  reward: {
    currency: string
    amount: number
    scale: number
  }
  createdBy: {
    discordHandle: string
    discordId: string
  }
  createdAt?: string
  dueAt?: string
  discordMessageId?: string
  status: string
  statusHistory?: { status: string; setAt: string }[]
  claimedBy?: {
    discordHandle: string
    discordId: string
  }
  claimedAt?: string
  submissionNotes?: string
  submissionUrl?: string
  submittedAt?: string
  submittedBy?: {
    discordHandle: string
    discordId: string
  }
  reviewedAt?: string
  reviewedBy?: {
    discordHandle: string
    discordId: string
  }
}

/* BountyBoardSchema will correspond to a collection in your MongoDB database. */
const BountyBoardSchema = new mongoose.Schema({
  title: {
    /* The name of this Bounty */

    type: String,
  },
  season: {
    /* The season of this Bounty */

    type: Number,
  },
  description: {
    /* A short description of the Bounty */

    type: String,
  },
  criteria: {
    /* Acceptance criteria of deliverables for the Bounty to be marked complete. */

    type: String,
  },
  reward: {
    /* Bounty reward */

    currency: String,
    amount: Number,
    scale: Number,
    type: Object,
  },
  createdBy: {
    /* Discord identity of bounty creator */

    discordHandle: String,
    discordId: Number,
    type: Object,
  },
  createdAt: {
    /* Date of Bounty creation */

    type: String,
  },
  dueAt: {
    /* Bounty Expiration */

    type: String,
  },
  discordMessageId: {
    type: String,
  },
  status: {
    /* Bounty Status */
    /* "Draft", "Open", "In-Progress", "In-Review", "Completed", "Deleted" */
    type: String,
  },
  statusHistory: {
    type: Array,
  },
  claimedBy: {
    discordHandle: String,
    discordId: Number,
    type: Object,
  },
  claimedAt: {
    type: String,
  },
  submissionNotes: {
    type: String,
  },
  submissionUrl: {
    type: String,
  },
  submittedAt: {
    type: String,
  },
  submittedBy: {
    discordHandle: String,
    discordId: Number,
    type: Object,
  },
  reviewedAt: {
    type: String,
  },
  reviewedBy: {
    discordHandle: String,
    discordId: Number,
    type: Object,
  },
})

export default mongoose.models.Bounty ||
  mongoose.model('Bounty', BountyBoardSchema)
