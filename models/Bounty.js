import mongoose from 'mongoose'

/* BountyBoardSchema will correspond to a collection in your MongoDB database. */
const BountyBoardSchema = new mongoose.Schema({
  name: {
    /* The name of this Bounty */

    type: String,
    required: [true, 'Please provide a name for this Bounty.'],
    maxlength: [20, 'Name cannot be more than 60 characters'],
  },
  owner_name: {
    /* The owner of this Bounty */

    type: String,
    required: [true, "Please provide the Bounty owner's name"],
    maxlength: [20, "Owner's Name cannot be more than 60 characters"],
  },
  guild: {
    /* The guild corresponding to the Bounty */

    type: String,
    required: [true, 'Please specify the species of your pet.'],
    maxlength: [30, 'Species specified cannot be more than 40 characters'],
  },
  reward: {
    /* Pet's age, if applicable */

    type: Number,
  },
  claimed: {
    /* Boolean claimed value, if applicable */

    type: Boolean,
  },
  claimedBy: {
    /* The guild corresponding to the Bounty */

    type: String,
    maxlength: [20, "Claimer's Name cannot be more than 60 characters"],
  },
  image_url: {
    /* Url to pet image */

    required: [true, 'Please provide an image url for this pet.'],
    type: String,
  },
  likes: {
    /* List of things your pet likes to do */

    type: Array,
  },
  dislikes: {
    /* List of things your pet does not like to do */

    type: Array,
  },
})

export default mongoose.models.Bounty || mongoose.model('Bounty', BountyBoardSchema)
