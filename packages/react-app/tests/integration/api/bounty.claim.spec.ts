import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, MockResponse, MockRequest } from 'node-mocks-http';
import { Connection } from 'mongoose';
import dbConnect from '@app/utils/dbConnect';
import Bounty, { ActivityHistoryItem, BountyBoardSchema, StatusHistoryItem } from '@app/models/Bounty';
import bountyClaimHandler from '@app/pages/api/bounties/[id]/claim';
import { testBounty } from '@tests/stubs/bounty.stub';
import { newActivityHistory, newStatusHistory } from '@app/utils/formUtils';
import BOUNTY_STATUS from '@app/constants/bountyStatus';
import ACTIVITY from '@app/constants/activity';

describe('Testing the bounty API', () => {
	const openBountyId = '61b1b528348333e470fd8c77';
	const inProgBountyId = '61b1b528348333e470fd8c88';

	const testOpenBounty = {
		_id: openBountyId,
		...testBounty,
	};

	const testInProgressBounty = {
		_id: inProgBountyId,
		...testBounty,
		status: 'In-Progress',
	};
	let connection: Connection;
	let req: MockRequest<NextApiRequest>;
	let res: MockResponse<NextApiResponse>;

	beforeAll(async () => {
		const connect = await dbConnect();
		connection = connect.connections[0];
		await connection.db.collection('bounties').dropIndexes();
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

	describe('Claiming through the API', () => {
		it('Allows us to claim an open bounty', async () => {
			req.body = {
				claimedBy: {
					discordHandle: 'testhandle',
					discordId: 'testid',
				},
				submissionNotes: 'Test',
				status: 'In-Progress',
				statusHistory: newStatusHistory(testOpenBounty.statusHistory as StatusHistoryItem[], BOUNTY_STATUS.IN_PROGRESS),
				activityHistory: newActivityHistory(testOpenBounty.activityHistory as ActivityHistoryItem[], ACTIVITY.CLAIM),
			};
			await bountyClaimHandler(req, res);
			expect(res.statusCode).toEqual(200);
		});

		it('Does not allow claiming a non-editable bounty', async () => {
			await Bounty.create(testInProgressBounty);
			req.query = {
				id: testInProgressBounty._id,
			};
			req.body = {
				claimedBy: {
					discordHandle: 'testhandle',
					discordId: 'testid',
				},
				submissionNotes: 'Test',
				status: 'In-Progress',
				statusHistory: newStatusHistory(testOpenBounty.statusHistory as StatusHistoryItem[], BOUNTY_STATUS.IN_PROGRESS),
				activityHistory: newActivityHistory(testOpenBounty.activityHistory as ActivityHistoryItem[], ACTIVITY.CLAIM),
			};
			await bountyClaimHandler(req, res);
			expect(res.statusCode).toEqual(400);
			expect(res._getJSONData().message).toEqual('Unable to edit bounty, as is not in an editable status');
		});

		it('Requires the status, claimant details and statusHistory passed', async () => {
			req.body = {
				submissionNotes: 'Test',
				status: 'In-Progress',
				statusHistory: newStatusHistory(testOpenBounty.statusHistory as StatusHistoryItem[], BOUNTY_STATUS.IN_PROGRESS),
				activityHistory: newActivityHistory(testOpenBounty.activityHistory as ActivityHistoryItem[], ACTIVITY.CLAIM),
			};
			await bountyClaimHandler(req, res);
			expect(res.statusCode).toEqual(400);

			req.body = {
				claimedBy: {
					discordHandle: 'testhandle',
					discordId: 'testid',
				},
				submissionNotes: 'Test',
				statusHistory: newStatusHistory(testOpenBounty.statusHistory as StatusHistoryItem[], BOUNTY_STATUS.IN_PROGRESS),
				activityHistory: newActivityHistory(testOpenBounty.activityHistory as ActivityHistoryItem[], ACTIVITY.CLAIM),
			};
			await bountyClaimHandler(req, res);
			expect(res.statusCode).toEqual(400);

			req.body = {
				claimedBy: {
					discordHandle: 'testhandle',
					discordId: 'testid',
				},
				submissionNotes: 'Test',
			};
			await bountyClaimHandler(req, res);
			expect(res.statusCode).toEqual(400);
		});
	});
});