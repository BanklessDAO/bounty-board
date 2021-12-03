import mongoose, { ObjectId } from 'mongoose';
import {
	string,
	number,
	object,
	array,
	SchemaOf,
	InferType,
	mixed,
} from 'yup';
import { TypedSchema } from 'yup/lib/util/types';

// funky casting to avoid undefined
type Nested<T extends TypedSchema> = SchemaOf<InferType<T>>

export const DiscordUser = object({
	discordHandle: string().required(),
	discordId: string().required(),
});

export const Reward = object({
	currency: string().min(0).required(),
	amount: number().min(0).required(),
	scale: number().min(0).required(),
	amountWithoutScale: number().min(0).required(),
});

export const Status = mixed().oneOf([
	'Draft',
	'Open',
	'In-Progress',
	'In-Review',
	'Completed',
	'Deleted',
]);

export const StatusHistory = object({
	status: Status,
	setAt: string(),
});

/* Global typing for Bounties */
export const BountySchema = object({
	title: string().required(),
	description: string().required(),
	criteria: string().required(),
	customer_id: string().required(),
	status: Status.required(),
	reward: Reward.required() as Nested<typeof Reward>,
	editKey: string(),
	
	statusHistory: array(
		StatusHistory as Nested<typeof StatusHistory>
	).optional(),
		
	discordMessageId: string().optional(),
	submissionNotes: string().optional(),
	submissionUrl: string().optional(),
	season: number().optional(),
	dueAt: string().optional(),

	createdAt: string().optional(),
	claimedAt: string().optional(),
	submittedAt: string().optional(),
	reviewedAt: string().optional(),
	
	createdBy: DiscordUser.required() as Nested<typeof DiscordUser>,
	claimedBy: DiscordUser.optional() as Nested<typeof DiscordUser>,
	submittedBy: DiscordUser.required() as Nested<typeof DiscordUser>,
	reviewedBy: DiscordUser.optional() as Nested<typeof DiscordUser>,
});


export interface BountyCollection extends InferType<typeof BountySchema> {
	_id: ObjectId | string;
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
	editKey: {
		/* Prevents editing by unauthorized users */
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
