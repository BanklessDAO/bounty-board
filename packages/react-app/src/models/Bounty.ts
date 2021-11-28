import mongoose from 'mongoose';
import {
	string,
	number,
	object,
	array,
	TypeOf,
} from 'yup';


/* Global typing for Bounties */
export const BountySchema = object({
	season: number().optional(),
	title: string().required(),
	description: string().required(),
	criteria: string().required(),
	customer_id: string().required(),
	reward: object({
		currency: string().required(),
		amount: number().min(0).required(),
		scale: number().required(),
		amountWithoutScale: number().required(),
	}).required(),
	createdBy: object({
		discordHandle: string().required(),
		discordId: string().required(),
	}).required(),
	createdAt: string().optional(),
	dueAt: string().optional(),
	discordMessageId: string().optional(),
	status: string().required(),
	statusHistory: array(object({
		status: string(),
		setAt: string(),
	})).optional(),
	claimedBy: object({
		discordHandle: string().optional(),
		discordId: string().optional(),
	}).optional(),
	claimedAt: string().optional(),
	submissionNotes: string().optional(),
	submissionUrl: string().optional(),
	submittedAt: string().optional(),
	submittedBy: object({
		discordHandle: string().required(),
		discordId: string().required(),
	}).required(),
	reviewedAt: string().optional(),
	reviewedBy: object({
		discordHandle: string(),
		discordId: string(),
	}).optional(),
});

export interface BountyBoardProps extends TypeOf<typeof BountySchema> {
	_id: any;
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

export default mongoose.models.Bounty ||
  mongoose.model('Bounty', BountyBoardSchema);
