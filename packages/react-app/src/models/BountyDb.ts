import mongoose from 'mongoose';
import { PaginateModel } from '../types/Paginate';
import { BountyCollection } from './Bounty';

// Have to use ignore here due to some strange error with typescript not picking
// up the declaration file, unless you change the name every deploy
// @ts-ignore
import { aggregate } from 'mongo-cursor-pagination';
import User from './User';


/* BountyBoardSchema will correspond to a collection in your MongoDB database. */
export const BountyBoardSchema = new mongoose.Schema({
	title: {
		/* The name of this Bounty */
		type: String,
	},
	customerId: {
		/* legacy identifier for backward compatability */
		type: String,
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
		iconUrl: String,
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
	paidStatus: {
		/* Bounty Paid Status */
		/* "Unpaid", "Paid" */
		type: String,
	},
	paidAt: {
		type: String,
	},
	paidBy: {
		discordHandle: String,
		discordId: Number,
		iconUrl: String,
		type: Object,
	},
	activityHistory: {
		type: Array,
	},
	claimedBy: {
		discordHandle: String,
		discordId: Number,
		iconUrl: String,
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
		iconUrl: String,
		type: Object,
	},
	reviewedAt: {
		type: String,
	},
	reviewedBy: {
		discordHandle: String,
		discordId: Number,
		iconUrl: String,
		type: Object,
	},
	createdInChannel: {
		type: String,
	},
	canonicalCard: {
		messageId: String,
		channelId: String,
		type: Object,
	},
	creatorMessage: {
		messageId: String,
		channelId: String,
		type: Object,
	},
	claimantMessage: {
		messageId: String,
		channelId: String,
		type: Object,
	},

	evergreen: {
		type: Boolean,
	},
	claimLimit: {
		type: Number,
	},
	isParent: {
		type: Boolean,
	},
	parentId: {
		type: String,
	},
	childrenIds: {
		type: Array,
		default: undefined,
	},
	isRepeatTemplate: {
		type: Boolean,
	},
	repeatTemplateId: {
		type: String,
	},
	repeatDays: {
		type: Number,
	},
	numRepeats: {
		type: Number,
	},
	endRepeatsDate: {
		type: String,
	},


	assign: {
		type: String,
	},
	assignedName: {
		type: String,
	},
	assignTo: {
		discordHandle: String,
		discordId: Number,
		iconUrl: String,
		type: Object,
	},
	gate: {
		type: Array,
		default: undefined,
	},
	gateTo: {
		type: Array,
		default: undefined,
	},
	requireApplication: {
		type: Boolean,
	},
	applicants: {
		type: Array,
		default: undefined,
	},
	isIOU: {
		type: Boolean,
	},
	resolutionNote: {
		type: String,
	},
	owedTo: {
		discordHandle: String,
		discordId: Number,
		iconUrl: String,
		type: Object,
	},
	tags: {
		keywords: Array,
		channelCategory: String,
		type: Object,
	},
}, {
	// So `res.json()` and other `JSON.stringify()` and `toObject()` functions include virtuals
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
});

BountyBoardSchema.virtual('payeeData', {
	ref: User,
	localField: 'claimedBy.discordId',
	foreignField: 'userDiscordId',
	justOne: true,
});

const aggregatePlugin = (schema: any, options: any) => {
	const aggregateFn = function(this: any, params: any) {
		if (!this.collection) {
			throw new Error('collection property not found');
		}

		return aggregate(this.collection, { populate: 'payeeData', ...params });
	};

	if (options && options.name) {
		schema.statics[options.name] = aggregate;
	} else {
		schema.statics.aggregateFn = aggregateFn;
	}
};

BountyBoardSchema.plugin(aggregatePlugin);

export default (mongoose.models.Bounty as PaginateModel<BountyCollection>) ||
  mongoose.model<BountyCollection>('Bounty', BountyBoardSchema);
