import { SchemaToInterface, ToInterface } from '../types/Models';
import { string, number, object, array, mixed, boolean } from 'yup';
import BOUNTYSTATUS from '@app/constants/bountyStatus';
import PAIDSTATUS from '@app/constants/paidStatus';
import ACTIVITY, { CLIENT } from '@app/constants/activity';

type RequiredForPostProps = {
  method: 'POST' | 'PATCH';
  schema: any;
  isObject?: boolean;
};
const requiredForPost = ({
	method,
	schema,
	isObject,
}: RequiredForPostProps) => {
	if (method === 'POST') {
		return schema.defined();
	}
	if (isObject) {
		// prevent overwriting object with null
		return schema.optional().default(undefined);
	} else {
		return schema.optional();
	}
};

type ParamsType =
  | { discordId: string | undefined; discordHandle: string | undefined }
  | undefined;
const bothRequiredIfOneRequired = (params: ParamsType): boolean => {
	/**
   * If discord id is specified, ensure discord handle is also specified
   */
	if (params && (params.discordHandle || params.discordId)) {
		const { discordId, discordHandle } = params;
		return !!discordId && !!discordHandle;
	}
	return true;
};

export const DiscordUser = object({
	discordId: string().optional(),
	discordHandle: string().optional(),
	iconUrl: string().optional().nullable(),
}).test(
	'is-optional',
	'${path}.discordId or ${path}.discordHandle is required',
	(params) =>
		bothRequiredIfOneRequired(
			params
				? { discordId: params.discordHandle, discordHandle: params.discordId }
				: undefined
		)
);

/**
 * Nested objects in yup behave strangely. We require a separate
 * object to conditionally require the fields inside of it
 */
export const RequiredDiscordUser = object({
	discordId: string()
		.optional()
		.when('$method', (method, schema) => requiredForPost({ method, schema })),
	discordHandle: string()
		.optional()
		.when('$method', (method, schema) => requiredForPost({ method, schema })),
	iconUrl: string().optional().nullable(),
}).test(
	'is-optional',
	'Missing one of [discordId, discordHandle] in ${path}',
	(params) => bothRequiredIfOneRequired(params)
);

export const RoleObject = object({
	discordId: string().optional(),
	discordName: string().optional(),
	iconUrl: string().optional(),
});

export const Applicant = object({
	discordId: string().optional(),
	discordHandle: string().optional(),
	pitch: string().optional(),
}).test(
	'is-optional',
	'${path}.discordId or ${path}.discordHandle is required',
	(params) =>
		bothRequiredIfOneRequired(
			params
				? { discordId: params.discordHandle, discordHandle: params.discordId }
				: undefined
		)
);

export const Reward = object({
	amount: number()
		.min(0)
		.when('$method', (method, schema) => requiredForPost({ method, schema })),
	currency: string()
		.default('BANK')
		.when('$method', (method, schema) => requiredForPost({ method, schema })),
	scale: number()
		.default(0)
		.when('$method', (method, schema) => requiredForPost({ method, schema })),
	amountWithoutScale: number().when('$method', (method, schema) =>
		requiredForPost({ method, schema })
	),
}).test(
	'is-optional',
	'Missing one of [amount, currency, scale, amountWithoutScale] in ${path}.',
	(params): boolean => {
		if (params) {
			const { amount, currency, scale } = params;
			const allDefined =
        (!!amount || amount === 0) && (!!scale || scale === 0) && !!currency;
			// && (!!amountWithoutScale || amountWithoutScale === 0) // Removed for bot compatibility

			return allDefined;
		}
		return true;
	}
);

export const status = mixed().oneOf(Object.values(BOUNTYSTATUS));
export const paidStatus = mixed().oneOf(Object.values(PAIDSTATUS));
export const activity = mixed().oneOf(Object.values(ACTIVITY));
export const client = mixed().oneOf(Object.values(CLIENT));

export const StatusHistory = object({
	status,
	modifiedAt: string(),
});

export const ActivityHistory = object({
	activity,
	client,
	modifiedAt: string(),
});

export const MessageInfo = object({
	messageId: string(),
	channelId: string(),
});

export const PayeeData = object({
	walletAddress: string(),
	userDiscordId: string(),
});

export const TagObject = object({
	channelCategory: string().optional(),
	keywords: array(string()),
});

export const BountySchema = object({
	_id: string().optional(),
	title: string().when('$method', (method, schema) =>
		requiredForPost({ method, schema })
	),
	description: string().when('$method', (method, schema) =>
		requiredForPost({ method, schema })
	),
	criteria: string().when('$method', (method, schema) =>
		requiredForPost({ method, schema })
	),
	customerId: string().when('$method', (method, schema) =>
		requiredForPost({ method, schema })
	),
	status: status.when('$method', (method, schema) =>
		requiredForPost({ method, schema })
	),
	dueAt: string().when('$method', (method, schema) =>
		requiredForPost({ method, schema })
	),
	reward: Reward.when('$method', (method, schema) =>
		requiredForPost({ method, schema, isObject: true })
	),
	season: string().optional(),

	paidStatus: paidStatus.optional(),
	paidAt: string().optional(),
	paidBy: DiscordUser.optional(),
	payeeData: PayeeData.optional(),
	tags: TagObject.default(undefined).optional(),

	statusHistory: array(StatusHistory).optional(),
	activityHistory: array(ActivityHistory).optional(),

	discordMessageId: string().optional().nullable(),
	submissionNotes: string().optional().nullable(),
	submissionUrl: string().optional().nullable(),
	createdInChannel: string().optional().nullable(),

	canonicalCard: MessageInfo.optional(),
	creatorMessage: MessageInfo.optional(),
	claimantMessage: MessageInfo.optional(),

	evergreen: boolean().optional(),
	claimLimit: number().min(0).max(100).optional(),
	isParent: boolean().optional(),
	parentId: string().optional().nullable(),
	childrenIds: array(string()).optional(),
	assign: string().optional().nullable(),
	assignedName: string().optional().nullable(),
	assignTo: DiscordUser.optional().default(undefined),
	gate: array(string()).optional(),
	gateTo: array(RoleObject).optional().default(undefined),
	requireApplication: boolean().optional(),
	applicants: array(Applicant).optional(),
	isIOU: boolean().optional(),
	resolutionNote: string().optional().nullable(),
	owedTo: DiscordUser.optional().default(undefined),

	createdAt: string().when('$method', (method, schema) =>
		requiredForPost({ method, schema })
	),
	claimedAt: string().optional(),
	submittedAt: string().optional(),
	reviewedAt: string().optional(),

	createdBy: RequiredDiscordUser.when('$method', (method, schema) =>
		requiredForPost({ method, schema, isObject: true })
	),
	claimedBy: DiscordUser.optional().default(undefined),
	submittedBy: DiscordUser.optional().default(undefined),
	reviewedBy: DiscordUser.optional().default(undefined),
}).noUnknown(true);

export const BountyClaimSchema = object({
	submissionNotes: string().required(),
	claimedBy: DiscordUser.required(),
	status: status.required(),
	statusHistory: array(StatusHistory).required(),
	activityHistory: array(ActivityHistory).required(),
}).noUnknown(true);

export const BountyPaidSchema = object({
	paidBy: DiscordUser.required(),
	paidStatus: paidStatus.required(),
	paidAt: string().required(),
	activityHistory: array(ActivityHistory).required(),
}).noUnknown(true);

export type BountyCollection = SchemaToInterface<typeof BountySchema>;
export type BountyClaimCollection = SchemaToInterface<typeof BountyClaimSchema>;
export type BountyPaidCollection = SchemaToInterface<typeof BountyPaidSchema>;
export type StatusHistoryItem = SchemaToInterface<typeof StatusHistory>;
export type ActivityHistoryItem = SchemaToInterface<typeof ActivityHistory>;
export type DiscordBoardUser = ToInterface<typeof DiscordUser>;
