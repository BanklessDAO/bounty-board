import mongoose from 'mongoose'

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
    required: [true, 'Bounty Season required']
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

    type: Object,
  },
  bountyGuild: {
    /* The guild corresponding to the Bounty */

    type: String,
    required: [true, 'Please specify the guild of the bounty.'],
    maxlength: [30, 'Species specified cannot be more than 40 characters'],
  },
  bountyCreatedBy: {
    /* The creator of the Bounty, specified by Discord handle */

    type: String,
    required: [true, 'Please specify your discord handle.'],
    maxlength: [40, 'Discord handles must be between 2 and 32 characters long'],
  },
  bountyExpiration: {
    /* Bounty Expiration */

    type: Number,
    required: [true, 'Please specify the bounty expiration in number of days'],
  },
})

export default mongoose.models.Bounty ||
  mongoose.model('Bounty', BountyBoardSchema)
