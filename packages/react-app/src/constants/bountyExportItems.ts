import { BountyCollection } from '@app/models/Bounty';

type bountyKeys = keyof BountyCollection;
type rewardKeys = keyof BountyCollection['reward'];
type createdByKeys = keyof BountyCollection['createdBy'];
type claimedByKeys = keyof BountyCollection['claimedBy'];

export const BOUNTY_EXPORT_ITEMS = [
	{ label: 'ID', key: ('_id' as bountyKeys) },
	{ label: 'Title', key: ('title' as bountyKeys) },
	{ label: 'Description', key: ('description' as bountyKeys) },
	{ label: 'Criteria', key: ('criteria' as bountyKeys) },
	{ label: 'Status', key: ('status' as bountyKeys) },
	{ label: 'Due', key: ('dueAt' as bountyKeys) },
	{ label: 'Reward Amount', key: ('reward' as bountyKeys) + '.' + ('amount' as rewardKeys) },
	{ label: 'Reward Currency', key: ('reward' as bountyKeys) + '.' + ('currency' as rewardKeys) },
	{ label: 'Created', key: ('createdAt' as bountyKeys) },
	{ label: 'Created By', key: ('createdBy' as bountyKeys) + '.' + ('discordHandle' as createdByKeys) },
	{ label: 'Claimed By', key: ('claimedBy' as bountyKeys) + '.' + ('discordHandle' as claimedByKeys) },
	{ label: 'Submission Notes', key: ('submissionNotes' as bountyKeys) },
	{ label: 'Submission URL', key: ('submissionUrl' as bountyKeys) },
	// { label: 'Paid Status', key: ('paidStatus' as bountyKeys).toString() },
];

export default BOUNTY_EXPORT_ITEMS;