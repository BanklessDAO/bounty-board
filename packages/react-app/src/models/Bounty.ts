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
  }
  createdBy: {
    discordHandle: string
    discordId: string
  }
  claimedBy?: {
    discordHandle: string
    discordId: string
  }
  createdAt?: string
  claimedAt?: number
  completedAt?: number
  completedBy?: { discordHandle: string; discordId: string }
  status: string
  statusHistory?: { status: string; setAt: string }[]
  submissionUrl?: string
}

/* BountyBoardSchema will correspond to a collection in your MongoDB database. */
const BountyBoardSchema = new mongoose.Schema({
  title: {
    /* The name of this Bounty */

    type: String,
    required: [true, 'Please provide a title for this Bounty.'],
    maxlength: [80, 'Name cannot be more than 60 characters'],
  },
  season: {
    /* The season of this Bounty */

    type: Number,
    required: [true, 'Bounty Season required'],
  },
  description: {
    /* A short description of the Bounty */

    type: String,
    required: [true, 'Please provide the bounty description'],
  },
  criteria: {
    /* Acceptance criteria of deliverables for the Bounty to be marked complete. */

    type: String,
    required: [true, 'Please provide the bounty acceptance criteria'],
  },
  reward: {
    /* Bounty reward */

    currency: String,
    amount: Number,
    type: Object,
    required: [true, 'Please provide the bounty reward'],
  },
  createdBy: {
    /* Discord identity of bounty creator */

    discordHandle: String,
    discordId: Number,
    type: Object,
    required: [true, 'Please provide your discord information'],
  },
  createdAt: {
    /* Date of Bounty creation */

    type: Date,
    required: [
      true,
      'Bounty createdAt should be populated. Please recreate Bounty in DEGEN or contact support.',
    ],
  },
  dueAt: {
    /* Bounty Expiration */

    type: Date,
  },
  status: {
    /* Bounty Status */
    /* "Draft", "Open", "In-Progress", "In-Review", "Completed", "Deleted" */
    type: String,
    required: [
      true,
      'Bounty status required. Recreate Bounty in DEGEN or contact support.',
    ],
  },
})

export default mongoose.models.Bounty ||
  mongoose.model('Bounty', BountyBoardSchema)
