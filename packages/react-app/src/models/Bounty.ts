import mongoose, { ObjectId } from 'mongoose';
import {
	string,
	number,
	object,
	array,
	TypeOf,
} from 'yup';

const UserObject = object({
	discordHandle: string().required(),
	discordId: string().required(),
});

const Reward = object({
	currency: string().min(0).required(),
	amount: number().min(0).required(),
	scale: number().min(0).required(),
	amountWithoutScale: number().min(0).required(),
})

/* Global typing for Bounties */
export const BountySchema = object({
	season: number().optional(),
	title: string().required(),
	description: string().required(),
	criteria: string().required(),
	customer_id: string().required(),
	reward: Reward.required(),
	
	discordMessageId: string().optional(),
	status: string().required(),
	statusHistory: array(object({
		status: string(),
		setAt: string(),
	})).optional(),
	
	submissionNotes: string().optional(),
	submissionUrl: string().optional(),
	
	dueAt: string().optional(),
	createdAt: string().optional(),
	claimedAt: string().optional(),
	submittedAt: string().optional(),
	reviewedAt: string().optional(),
	
	createdBy: UserObject.required(),
	claimedBy: UserObject.optional(),
	submittedBy: UserObject.required(),
	reviewedBy: UserObject.optional(),
});

export interface BountyCollection extends TypeOf<typeof BountySchema> {
	_id: ObjectId;
}

/* BountyBoardSchema will correspond to a collection in your MongoDB database. */
const BountyBoardSchema = new mongoose.Schema({
	title: {
		/* The name of this Bounty */

		type: String,
	},
	customer_id: {
		/* the DAO under which this bounty belongs */

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
		amountWithoutScale: Number,
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
});

export default mongoose.models.Bounty as mongoose.Model<BountyCollection> ||
  mongoose.model<BountyCollection>('Bounty', BountyBoardSchema);
