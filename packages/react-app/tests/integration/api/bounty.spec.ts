import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, MockResponse, MockRequest } from 'node-mocks-http';
import { Connection } from 'mongoose';
import dbConnect from '../../../src/utils/dbConnect';
import Bounty, { BountyCollection, BountyBoardSchema } from '../../../src/models/Bounty';
import bountiesHandler from '../../../src/pages/api/bounties';
import bountyHandler from '../../../src/pages/api/bounties/[id]';
import { testBounty } from '../../stubs/bounty.stub';
import bounties from '../../stubs/bounties.stub.json';

describe('Testing the bounty API', () => {
	let connection: Connection;
	let req: MockRequest<NextApiRequest>;
	let res: MockResponse<NextApiResponse>;

	beforeAll(async () => {
		const connect = await dbConnect();
		connection = connect.connections[0];
		BountyBoardSchema.index({ title: 'text' });
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
				key: testBounty.editKey as string,
			};

			await bountyHandler(req, res);
			expect(res._getJSONData().data.reward.amount)
				.toEqual(testFieldChange.reward.amount);
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

		it('Rejects edit without an edit key or invalid edit key', async () => {
			const _id = '61b1b528348333e470fd8c99';
			const editKey = 'TESTK3Y';
			const testPatchBounty = { _id, editKey, ...testBounty };
			await Bounty.create(testPatchBounty);
			req.body = { description: 'fail' };
			req.method = 'PATCH';
			req.query = {
				id: _id,
			};
			await bountyHandler(req, res);
			expect(res.statusCode).toEqual(400);
			req.query = {
				id: _id,
				key: 'F41L',
			};
			await bountyHandler(req, res);
			expect(res.statusCode).toEqual(400);
		});

		it('Rejects editing a nested property without specifying all fields for reward', async () => {
			const _id = '61b1b528348333e470fd8c99';
			const editKey = 'TESTK3Y';
			const testPatchBounty = { _id, editKey, ...testBounty };
			await Bounty.create(testPatchBounty);
			req.body = { reward: { amount: 200 } };
			req.method = 'PATCH';
			req.query = {
				id: _id,
				key: editKey,
			};
			await bountyHandler(req, res);
			expect(res.statusCode).toEqual(400);
		});

		it('Rejects editing a nested property without specifying all fields for discord ids', async () => {
			const _id = '61b1b528348333e470fd8c99';
			const editKey = 'TESTK3Y';
			const testPatchBounty = { _id, editKey, ...testBounty };
			await Bounty.create(testPatchBounty);
			req.body = { createdBy: { discordHandle: 'Missing discord Id' } };
			req.method = 'PATCH';
			req.query = {
				id: _id,
				key: editKey,
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
			req.query.key = testBounty.editKey as string;
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
			const allOpenStatuses = data.every((d: BountyCollection) => d.status === 'Open');
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

		it('Can perform a text search', async () => {
			req.method = 'GET';
			req.query = {
				search: 'react',
			};
			await bountiesHandler(req, res);
			const { data } = res._getJSONData();
			const correctSearchTerm = data[0].title === 'Implement React Components for Filters';
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
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
	});
});