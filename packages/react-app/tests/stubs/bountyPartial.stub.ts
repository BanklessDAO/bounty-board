import { BountyCollection } from '../../src/models/Bounty';

export const testBountyPartial: Partial<BountyCollection> = {
	customerId: '834499078434979890',
	criteria: 'TEST CRITERIA',
	reward: {
		currency: 'BANK',
		amount: 1000,
		scale: 2,
		amountWithoutScale: 10,
	},
	createdBy: {
		discordHandle: 'TESTHANDLE#1234',
		discordId: '324439902343239764',
		iconUrl: '',
	},
	createdAt: '2021-07-20T06:40:56.112Z',
	dueAt: '2021-07-20T06:42:28.853Z',
	claimedAt: '2021-07-20T07:00:31.166Z',
	status: 'Open',
	statusHistory: [
		{
			status: 'Open',
			modifiedAt: '2021-07-20T07:00:31.166Z',
		},
		{
			status: 'Draft',
			modifiedAt: '2021-07-20T07:00:31.166Z',
		},
		{
			status: 'In-Progress',
			modifiedAt: '2021-07-20T07:00:31.166Z',
		},
		{
			status: 'In-Review',
			modifiedAt: '2021-07-20T07:00:31.166Z',
		},
		{
			status: 'Completed',
			modifiedAt: '2021-07-20T07:00:31.166Z',
		},
		{
			status: 'Deleted',
			modifiedAt: '2021-07-20T07:00:31.166Z',
		},
	],
};