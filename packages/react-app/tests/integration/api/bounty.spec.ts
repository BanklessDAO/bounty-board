import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, MockResponse, MockRequest } from 'node-mocks-http';
import { Connection } from 'mongoose';
import dbConnect from '@app/utils/dbConnect';
import { BountyCollection } from '@app/models/Bounty';
import Bounty, { BountyBoardSchema } from '@app/models/BountyDb';
import bountiesHandler from '@app/pages/api/bounties';
import bountyHandler from '@app/pages/api/bounties/[id]';
import { testBounty } from '@tests/stubs/bounty.stub';
import bounties from '@tests/stubs/bounties.stub.json';
import { testUser } from '@tests/stubs/user.stub';
import PAID_STATUS from '@app/constants/paidStatus';
import User from '@app/models/User';

describe('Testing the bounty API', () => {
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

	beforeEach(() => {
		const output = createMocks();
		req = output.req;
		res = output.res;
	});

	afterEach(async () => {
		jest.clearAllMocks();
		await Bounty.deleteMany();
		await User.deleteMany();
	});

	describe('CRUD operations through the API', () => {
		it('Can create a bounty', async () => {
			req.body = testBounty;
			req.method = 'POST';
			await bountiesHandler(req, res);
			expect(res._getJSONData().data).toEqual(
				expect.objectContaining(testBounty)
			);
			expect(res.statusCode).toEqual(201);
		});

		it('Can get bounties', async () => {
			await Bounty.insertMany([testBounty, testBounty]);
			req.method = 'GET';
			await bountiesHandler(req, res);
			expect(res.statusCode).toEqual(200);
			expect(res._getJSONData().data.length).toEqual(2);
		});

		it('Can get a bounty', async () => {
			const _id = '61b1b528348333e470fd8c99';
			const testGetBounty = { _id, ...testBounty };

			await Bounty.create(testGetBounty);

			req.method = 'GET';
			req.query = {
				id: _id,
			};

			await bountyHandler(req, res);
			expect(res._getJSONData().data).toEqual(
				expect.objectContaining(testGetBounty)
			);
			expect(res.statusCode).toEqual(200);
		});

		it('Can update a bounty with PATCH', async () => {
			const _id = '61b1b528348333e470fd8c99';
			const testPatchBounty = { _id, ...testBounty };

			await Bounty.create(testPatchBounty);

			const testFieldChange = {
				reward: {
					currency: 'BANK',
					amount: 200_000,
					scale: 0,
					amountWithoutScale: 200_000,
				},
			};
			req.body = testFieldChange;
			req.method = 'PATCH';
			req.query = {
				id: _id,
			};

			await bountyHandler(req, res);
			expect(res._getJSONData().data.reward.amount).toEqual(
				testFieldChange.reward.amount
			);
			expect(res.statusCode).toEqual(200);
		});

		it('Can delete a bounty', async () => {
			const _id = '61b1b528348333e470fd8c99';
			const testDeleteBounty = { _id, ...testBounty };

			await Bounty.create(testDeleteBounty);

			req.method = 'DELETE';
			req.query = {
				id: _id,
			};

			await bountyHandler(req, res);
			const bounty = await Bounty.findById(_id);
			expect(res.statusCode).toEqual(204);
			expect(bounty).toEqual(null);
		});
	});

	describe('Unhappy paths', () => {
		it('Rejects empty bounty create', async () => {
			req.method = 'POST';
			req.body = {};
			await bountiesHandler(req, res);
			expect(res.statusCode).toEqual(400);
		});

		it('Rejects bounty with unknown fields in POST', async () => {
			req.body = { ...testBounty, not: 'a field' };
			req.method = 'POST';
			await bountiesHandler(req, res);
			expect(res.statusCode).toEqual(400);
		});

		it('Rejects bounty with missing fields in POST', async () => {
			const { createdBy, ...rest } = testBounty;
			req.method = 'POST';
			req.body = rest;
			await bountiesHandler(req, res);
			expect(res.statusCode).toEqual(400);
			// typescript supress
			createdBy;
		});

		it('Rejects editing a nested property without specifying all fields for reward', async () => {
			const _id = '61b1b528348333e470fd8c99';
			const testPatchBounty = { _id, ...testBounty };
			await Bounty.create(testPatchBounty);
			req.body = { reward: { amount: 200 } };
			req.method = 'PATCH';
			req.query = {
				id: _id,
			};
			await bountyHandler(req, res);
			expect(res.statusCode).toEqual(400);
		});

		it('Rejects editing a nested property without specifying all fields for discord ids', async () => {
			const _id = '61b1b528348333e470fd8c99';
			const testPatchBounty = { _id, ...testBounty };
			await Bounty.create(testPatchBounty);
			req.body = { createdBy: { discordHandle: 'Missing discord Id' } };
			req.method = 'PATCH';
			req.query = {
				id: _id,
			};
			await bountyHandler(req, res);
			expect(res.statusCode).toEqual(400);
			req.body = { claimedBy: { discordId: 'Missing discord handle' } };
			await bountyHandler(req, res);
			expect(res.statusCode).toEqual(400);
		});

		it('Rejects and invalid id string, for all routes', async () => {
			const _id = '61b1b528348333e470fd8c99';
			const testBountyWithId = { _id, ...testBounty };
			await Bounty.create(testBountyWithId);

			req.query = {
				id: '999999999999999999999999',
			};
			req.method = 'GET';
			await bountyHandler(req, res);
			expect(res.statusCode).toEqual(404);

			req.method = 'PATCH';
			req.body = { title: 'test' };
			await bountyHandler(req, res);
			expect(res.statusCode).toEqual(404);

			req.method = 'DELETE';
			await bountyHandler(req, res);
			expect(res.statusCode).toEqual(404);
		});
	});

	describe('Pagination, searching, sorting and filtering', () => {
		beforeEach(async () => {
			await Bounty.insertMany(bounties);
		});

		it('Filters results by status', async () => {
			req.method = 'GET';
			req.query = {
				status: 'Open',
			};
			await bountiesHandler(req, res);
			const { data } = res._getJSONData();
			const allOpenStatuses = data.every(
				(d: BountyCollection) => d.status === 'Open'
			);
			expect(data.length).toBeGreaterThan(0);
			expect(allOpenStatuses).toEqual(true);
		});

		it('Defaults to filtering all', async () => {
			req.method = 'GET';
			await bountiesHandler(req, res);
			const { data } = res._getJSONData();
			const customerIds = data.map((d: BountyCollection) => d.customerId);
			const uniqueIds = new Set(customerIds);
			expect(uniqueIds.size).toBeGreaterThan(1);
		});

		it('Filters results by paid status', async () => {
			req.method = 'GET';
			req.query = {
				paidStatus: PAID_STATUS.PAID,
			};
			await bountiesHandler(req, res);
			const { data } = res._getJSONData();
			const paidStatuses = data.every(
				(d: BountyCollection) => d.paidStatus === PAID_STATUS.PAID
			);
			expect(data.length).toBeGreaterThan(0);
			expect(paidStatuses).toEqual(true);
		});

		it('Filters results by unpaid status', async () => {
			req.method = 'GET';
			req.query = {
				paidStatus: PAID_STATUS.UNPAID,
			};
			await bountiesHandler(req, res);
			const { data } = res._getJSONData();
			const paidStatuses = data.every(
				(d: BountyCollection) =>
					d.paidStatus === PAID_STATUS.UNPAID || !d.paidStatus
			);
			expect(data.length).toBeGreaterThan(0);
			expect(paidStatuses).toEqual(true);
		});

		it('Can perform a text search on title', async () => {
			req.method = 'GET';
			req.query = {
				search: 'react',
			};
			await bountiesHandler(req, res);
			const { data } = res._getJSONData();
			const correctSearchTerm =
        data[0].title === 'Implement React Components for Filters';
			expect(correctSearchTerm).toEqual(true);
		});

		it('Finds Claimed By Me', async () => {
			const userId = '703336960051118256';
			req.method = 'GET';
			req.query = {
				claimedBy: userId,
			};
			await bountiesHandler(req, res);
			const { data } = res._getJSONData();
			const foundBounty =
        data[0].title === 'Create logic to add Pagination to search filters';
			expect(foundBounty).toEqual(true);
			expect(data.length).toEqual(1);
		});

		it('Finds Created By Me', async () => {
			const userId = '703336960051118256';
			req.method = 'GET';
			req.query = {
				createdBy: userId,
			};
			await bountiesHandler(req, res);
			const { data } = res._getJSONData();
			const foundBounty = data[0].title === 'Create notes for one meeting';
			expect(foundBounty).toEqual(true);
			expect(data.length).toEqual(1);
		});

		it('Can perform a wildcard text search on name', async () => {
			req.method = 'GET';
			req.query = {
				search: 'jordaniza',
			};
			await bountiesHandler(req, res);
			const { data } = res._getJSONData();
			expect(data.length).toEqual(1);
		});

		it('Can perform a wildcard text search on description', async () => {
			req.method = 'GET';
			req.query = {
				search: 'dinosaurs',
			};
			await bountiesHandler(req, res);
			const { data } = res._getJSONData();
			const correctSearchTerm =
        data[0].description === 'Penguins and dinosaurs';
			expect(correctSearchTerm).toEqual(true);
		});

		it('Can paginate', async () => {
			req.method = 'GET';
			req.query = {
				limit: '1',
			};
			await bountiesHandler(req, res);
			const { data } = res._getJSONData();
			expect(data.length).toEqual(1);
		});

		it('Has a reusable cursor', async () => {
			req.method = 'GET';
			req.query = {
				limit: '1',
			};
			await bountiesHandler(req, res);
			console.warn('Testing for cursors needs more specific test cases');
		});

		it('defaults to being sorted by createdAt in descending order', async () => {
			req.method = 'GET';
			await bountiesHandler(req, res);
			const { data }: { data: BountyCollection[] } = res._getJSONData();
			const sortedByCreatedAtDesc = data.slice().sort((a, b) => {
				if (a.createdAt && b.createdAt && a.createdAt && b.createdAt) {
					return (
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					);
				}
				return 1;
			});
			expect(data).toEqual(sortedByCreatedAtDesc);
		});

		it('Can be sorted by reward in descending order', async () => {
			req.method = 'GET';
			req.query = {
				asc: 'false',
				sortBy: 'reward',
			};
			await bountiesHandler(req, res);
			const { data }: { data: BountyCollection[] } = res._getJSONData();
			const sortedByRewardDesc = data.slice().sort((a, b) => {
				if (a.reward && b.reward && a.reward.amount && b.reward.amount) {
					return b.reward.amount - a.reward.amount;
				}
				return 1;
			});
			expect(data).toEqual(sortedByRewardDesc);
		});

		it('API returns no payee data if Bounty is claimed and user is not registered', async () => {
			req.method = 'GET';
			req.query = {
				asc: 'false',
				sortBy: 'reward',
			};
			await bountiesHandler(req, res);
			const { data }: { data: BountyCollection[] } = res._getJSONData();
			const claimedBounty : any = data.find(bounty => bounty._id == '10f6585b453e70eed340e8e3');
			expect(claimedBounty).toBeDefined();
			expect(claimedBounty?.claimedBy.discordId).toEqual('324423432343239764');
			expect(claimedBounty?.payeeData?.userDiscordId).toBeUndefined();
		});

		it('API returns payee data if Bounty is claimed and user is registered', async () => {
			await User.insertMany(testUser);

			req.method = 'GET';
			req.query = {
				asc: 'false',
				sortBy: 'reward',
			};
			await bountiesHandler(req, res);
			const { data }: { data: BountyCollection[] } = res._getJSONData();
			const claimedBounty : any = data.find(bounty => bounty._id == '10f6585b453e70eed340e8e3');
			expect(claimedBounty).toBeDefined();
			expect(claimedBounty?.claimedBy.discordId).toEqual('324423432343239764');
			expect(claimedBounty?.payeeData?.userDiscordId).toEqual('324423432343239764');
			expect(claimedBounty?.payeeData?.walletAddress).toEqual('0xb57a97cDbEc1B71E9F0E33e76f7334984375cfdf');
		});

	});
});
