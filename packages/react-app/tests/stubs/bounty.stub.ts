import { BountyCollection } from '../../src/models/Bounty';

export const testBounty: Partial<BountyCollection> = {
	customerId: '834499078434979890',
	title: 'TEST TITLE',
	description: 'TEST DESCRIPTION',
	criteria: 'TEST CRITERIA',
	reward: {
		currency: 'BANK',
		amount: 1000,
		scale: 2,
		amountWithoutScale: 10,
	},
	discordMessageId: '',
	submissionNotes: '',
	submissionUrl: '',
	submittedAt: '',
	createdBy: {
		discordHandle: 'TESTHANDLE#1234',
		discordId: '324439902343239764',
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
	],
};