import { BountyCollection } from '@app/models/Bounty';

type NestedDotNotationKeys<T, K extends keyof T & string> = `${K}.${Extract<
  keyof T[K],
  string
>}`;

type RewardKeys = NestedDotNotationKeys<BountyCollection, 'reward'>;
type CreatedByKeys = NestedDotNotationKeys<BountyCollection, 'createdBy'>;
type ClaimedByKeys = NestedDotNotationKeys<BountyCollection, 'claimedBy'>;

type BountyExportKeys =
  | keyof Omit<BountyCollection, 'reward' | 'createdBy' | 'claimedBy'>
  | RewardKeys
  | CreatedByKeys
  | ClaimedByKeys;

type BountyExportItems = Array<{
  label: string;
  key: BountyExportKeys;
}>;

export const BOUNTY_EXPORT_ITEMS: BountyExportItems = [
	{ label: 'ID', key: '_id' },
	{ label: 'Title', key: 'title' },
	{ label: 'Description', key: 'description' },
	{ label: 'Criteria', key: 'criteria' },
	{ label: 'Status', key: 'status' },
	{ label: 'Due', key: 'dueAt' },
	{ label: 'Reward Amount', key: 'reward.amount' },
	{ label: 'Reward Currency', key: 'reward.currency' },
	{ label: 'Created', key: 'createdAt' },
	{ label: 'Created By', key: 'createdBy.discordHandle' },
	{ label: 'Claimed By', key: 'claimedBy.discordHandle' },
	{ label: 'Submission Notes', key: 'submissionNotes' },
	{ label: 'Submission URL', key: 'submissionUrl' },
];

export default BOUNTY_EXPORT_ITEMS;
