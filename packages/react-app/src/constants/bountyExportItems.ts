import { BountyCollection } from '@app/models/Bounty';

type NestedDotNotationKeys<T, K extends keyof T & string> = `${K}.${Extract<
  keyof T[K],
  string
>}`;

type RewardKeys = NestedDotNotationKeys<BountyCollection, 'reward'>;
type CreatedByKeys = NestedDotNotationKeys<BountyCollection, 'createdBy'>;
type ClaimedByKeys = NestedDotNotationKeys<BountyCollection, 'claimedBy'>;
type PaidByKeys = NestedDotNotationKeys<BountyCollection, 'paidBy'>;
type TagKeys = NestedDotNotationKeys<BountyCollection, 'tags'>;

type BountyExportKeys =
  | keyof Omit<BountyCollection, 'reward' | 'createdBy' | 'claimedBy'>
  | RewardKeys
  | CreatedByKeys
  | ClaimedByKeys
  | PaidByKeys
  | TagKeys
  | 'payeeData.walletAddress'
  | 'compositeName'
  | 'tagList'
  | 'tokenContract';

type BountyExportItems = Array<{
  label: string;
  key: BountyExportKeys;
}>;

export const BOUNTY_LIMITED_EXPORT_ITEMS: BountyExportItems = [
	{ label: 'ID', key: '_id' },
	{ label: 'Title', key: 'title' },
	{ label: 'Description', key: 'description' },
	{ label: 'Criteria', key: 'criteria' },
	{ label: 'Tags', key: 'tagList' },
	{ label: 'Channel Category', key: 'tags.channelCategory' },
	{ label: 'Status', key: 'status' },
	{ label: 'Due', key: 'dueAt' },
	{ label: 'Reward Amount', key: 'reward.amount' },
	{ label: 'Reward Currency', key: 'reward.currency' },
	{ label: 'Created', key: 'createdAt' },
	{ label: 'Created By', key: 'createdBy.discordHandle' },
	{ label: 'Claimed By', key: 'claimedBy.discordHandle' },
	{ label: 'Paid By', key: 'paidBy.discordHandle' },
	{ label: 'Paid At', key: 'paidAt' },
	{ label: 'Pay Address', key: 'payeeData.walletAddress' },
	{ label: 'Submission Notes', key: 'submissionNotes' },
	{ label: 'Submission URL', key: 'submissionUrl' },
];

export const BOUNTY_PARCEL_EXPORT_ITEMS: BountyExportItems = [
	{ label: 'Name', key: 'compositeName' },
	{ label: 'Address', key: 'payeeData.walletAddress' },
	{ label: 'Amount', key: 'reward.amount' },
	{ label: 'Token', key: 'tokenContract' },
];
