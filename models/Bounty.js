import mongoose from 'mongoose'

/* BountyBoardSchema will correspond to a collection in your MongoDB database. */
const BountyBoardSchema = new mongoose.Schema({
  bountyTitle: {
    /* The name of this Bounty */

    type: String,
    required: [true, 'Please provide a title for this Bounty.'],
    maxlength: [40, 'Name cannot be more than 60 characters'],
  },
  bountyDescription: {
    /* The owner of this Bounty */

    type: String,
    required: [true, "Please provide the bounty description"],
    maxlength: [140, "Bounty description cannot be more than 140 characters"],
  },
  bountyCriteria: {
    /* The criteria of this Bounty */

    type: String,
    required: [true, "Please provide the bounty acceptance criteria"],
    maxlength: [140, "Bounty criteria cannot be more than 140 characters"],
  },
  bountyReward: {
    /* Bounty reward */

    type: Number,
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
    required: [true, 'Please specify the bounty expiration in number of days']
  },
  bountyImage: {
    /* Url to bounty image */

    required: [true, 'Please provide an image url for this pet.'],
    type: String,
  },
})

export default mongoose.models.Bounty || mongoose.model('Bounty', BountyBoardSchema)
