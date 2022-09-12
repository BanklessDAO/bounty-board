import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, MockResponse, MockRequest } from 'node-mocks-http';
import { Connection } from 'mongoose';
import dbConnect from '@app/utils/dbConnect';
import Bounty, { ActivityHistoryItem, BountyBoardSchema } from '@app/models/Bounty';
import bountyPaidHandler from '@app/pages/api/bounties/[id]/paid';
import { testBounty } from '@tests/stubs/bounty.stub';
import { newActivityHistory } from '@app/utils/formUtils';
import BOUNTY_STATUS from '@app/constants/bountyStatus';
import ACTIVITY from '@app/constants/activity';
import PAID_STATUS from '@app/constants/paidStatus';

describe('Testing the bounty API', () => {
	const openBountyId = '61b1b528348333e470fd8c44';
	const inProgressBountyId = '61b1b528348333e470fd8c55';
	const completedBountyId = '61b1b528348333e470fd8c66';
	const inReviewBountyId = '61b1b528348333e470fd8c77';
	const deletedBountyId = '61b1b528348333e470fd8c88';

	const testOpenBounty = {
		_id: openBountyId,
		...testBounty,
	};

	const testDeletedBounty = {
		_id: deletedBountyId,
		...testBounty,
		status: BOUNTY_STATUS.DELETED,
	};
	const testInProgressBounty = {
		_id: inProgressBountyId,
		...testBounty,
		status: BOUNTY_STATUS.IN_PROGRESS,
	};
	const testInReviewBounty = {
		_id: inReviewBountyId,
		...testBounty,
		status: BOUNTY_STATUS.IN_REVIEW,
	};
	const testCompletedBounty = {
		_id: completedBountyId,
		...testBounty,
		status: BOUNTY_STATUS.COMPLETED,
	};

	let connection: Connection;
	let req: MockRequest<NextApiRequest>;
	let res: MockResponse<NextApiResponse>;

	beforeAll(async () => {
		const connect = await dbConnect();
		connection = connect.connections[0];
		try {
			await connection.db.collection('bounties').dropIndexes();
		} catch {
			console.log('Attempted to drop a non-existant index, moving on...');
		}
		BountyBoardSchema.index({ '$**': 'text' });
		await Bounty.createIndexes();
	});

	afterAll(async () => {
		await connection.close();
	});

	beforeEach(async () => {
		await Bounty.create(testOpenBounty);
		const output = createMocks();
		req = output.req;
		req.query = {
			id: testOpenBounty._id,
		};
		res = output.res;
		req.method = 'PATCH';
	});

	afterEach(async () => {
		jest.clearAllMocks();
		await Bounty.deleteMany();
	});

	describe('Marking Paid through the API', () => {

		it('Not pay an open bounty', async () => {

			req.body = {
				paidBy: {
					discordHandle: 'testhandle',
					discordId: 'testid',
				},
				paidStatus: PAID_STATUS.PAID,
				paidAt: new Date().toISOString(),
				activityHistory: newActivityHistory(
					testOpenBounty.activityHistory as ActivityHistoryItem[],
					ACTIVITY.PAID
				),
			};
			await bountyPaidHandler(req, res);
			expect(res.statusCode).toEqual(400);
			expect(res._getJSONData().message).toEqual(
				'Unable to mark bounty as paid, as is not in an payable status'
			);
		});

		it('Not pay a deleted bounty', async () => {
			await Bounty.create(testDeletedBounty);
			req.query = {
				id: testDeletedBounty._id,
			};

			req.body = {
				paidBy: {
					discordHandle: 'testhandle',
					discordId: 'testid',
				},
				paidStatus: PAID_STATUS.PAID,
				paidAt: new Date().toISOString(),
				activityHistory: newActivityHistory(
					testDeletedBounty.activityHistory as ActivityHistoryItem[],
					ACTIVITY.PAID
				),
			};
			await bountyPaidHandler(req, res);
			expect(res.statusCode).toEqual(400);
			expect(res._getJSONData().message).toEqual(
				'Unable to mark bounty as paid, as is not in an payable status'
			);
		});

		it('Pay an In Progress Bounty', async () => {
			await Bounty.create(testInProgressBounty);
			req.query = {
				id: testInProgressBounty._id,
			};

			req.body = {
				paidBy: {
					discordHandle: 'testhandle',
					discordId: 'testid',
				},
				paidStatus: PAID_STATUS.PAID,
				paidAt: new Date().toISOString(),
				activityHistory: newActivityHistory(
					testInProgressBounty.activityHistory as ActivityHistoryItem[],
					ACTIVITY.PAID
				),
			};
			await bountyPaidHandler(req, res);
			expect(res.statusCode).toEqual(200);
		});

		it('Pay an In Progress Bounty', async () => {
			await Bounty.create(testInProgressBounty);
			req.query = {
				id: testInProgressBounty._id,
			};

			req.body = {
				paidBy: {
					discordHandle: 'testhandle',
					discordId: 'testid',
				},
				paidStatus: PAID_STATUS.PAID,
				paidAt: new Date().toISOString(),
				activityHistory: newActivityHistory(
					testInProgressBounty.activityHistory as ActivityHistoryItem[],
					ACTIVITY.PAID
				),
			};
			await bountyPaidHandler(req, res);
			expect(res.statusCode).toEqual(200);
		});

		it('Pay an In Review Bounty', async () => {
			await Bounty.create(testInReviewBounty);
			req.query = {
				id: testInReviewBounty._id,
			};

			req.body = {
				paidBy: {
					discordHandle: 'testhandle',
					discordId: 'testid',
				},
				paidStatus: PAID_STATUS.PAID,
				paidAt: new Date().toISOString(),
				activityHistory: newActivityHistory(
					testInReviewBounty.activityHistory as ActivityHistoryItem[],
					ACTIVITY.PAID
				),
			};
			await bountyPaidHandler(req, res);
			expect(res.statusCode).toEqual(200);
		});

		it('Requires the data values to be passed', async () => {
			req.body = {
				paidStatus: PAID_STATUS.PAID,
				paidAt: new Date().toISOString(),
				activityHistory: newActivityHistory(
					testCompletedBounty.activityHistory as ActivityHistoryItem[],
					ACTIVITY.PAID
				),
			};

			await bountyPaidHandler(req, res);
			expect(res.statusCode).toEqual(400);

			req.body = {
				paidBy: {
					discordHandle: 'testhandle',
					discordId: 'testid',
				},
				paidAt: new Date().toISOString(),
				activityHistory: newActivityHistory(
					testCompletedBounty.activityHistory as ActivityHistoryItem[],
					ACTIVITY.PAID
				),
			};

			await bountyPaidHandler(req, res);
			expect(res.statusCode).toEqual(400);

			req.body = {
				paidBy: {
					discordHandle: 'testhandle',
					discordId: 'testid',
				},
				paidStatus: PAID_STATUS.PAID,
				activityHistory: newActivityHistory(
					testCompletedBounty.activityHistory as ActivityHistoryItem[],
					ACTIVITY.PAID
				),
			};

			await bountyPaidHandler(req, res);
			expect(res.statusCode).toEqual(400);

			req.body = {
				paidBy: {
					discordHandle: 'testhandle',
					discordId: 'testid',
				},
				paidStatus: PAID_STATUS.PAID,
				paidAt: new Date().toISOString(),
			};

			await bountyPaidHandler(req, res);
			expect(res.statusCode).toEqual(400);
		});
	});
});
