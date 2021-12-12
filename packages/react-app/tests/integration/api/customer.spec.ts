import dbConnect from '../../../src/utils/dbConnect';
import Customer from '../../../src/models/Customer';
import { Connection } from 'mongoose';
import { createMocks, MockResponse, MockRequest } from 'node-mocks-http';
import customersHandler from '../../../src/pages/api/customers';
import customerHandler from '../../../src/pages/api/customers/[id]';
import userCustomerHandler from '../../../src/pages/api/customers/user';
import { NextApiRequest, NextApiResponse } from 'next';
import { customers } from '../../stubs/customers.stub';
import { guilds } from '../../stubs/guilds.stub';

const testCustomer = customers[1];

describe('Testing the customer API', () => {
	let connection: Connection;
	let req: MockRequest<NextApiRequest>;
	let res: MockResponse<NextApiResponse>;

	beforeAll(async () => {
		const connect = await dbConnect();
		connection = connect.connections[0];
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
		await Customer.deleteMany();
	});

	describe('CRUD operations through the API', () => {
		it('Can create a customer', async () => {
			req.body = testCustomer;
			req.method = 'POST';
			await customersHandler(req, res);
			expect(res.statusCode).toEqual(201);
			expect(res._getJSONData().data.customerName).toEqual(testCustomer.customerName);
		});

		it('Can get customers', async () => {
			await Customer.insertMany([testCustomer, testCustomer]);
			req.method = 'GET';
			await customersHandler(req, res);
			expect(res.statusCode).toEqual(200);
			expect(res._getJSONData().data.length).toEqual(2);
		});

		it('Can get a customer', async () => {
			const _id = '61b1b528348333e470fd8c99';
			const testGetCustomer = { _id, ...testCustomer };

			await Customer.create(testGetCustomer);
      
			req.method = 'GET';
			req.query = {
				id: _id,
			};

			await customerHandler(req, res);
			expect(res.statusCode).toEqual(200);
			expect(res._getJSONData().data.customerName).toEqual(testCustomer.customerName);
		});

		it('Can update a customer with PUT', async () => {
			const _id = '61b1b528348333e470fd8c99';
			const testPutCustomer = { _id, ...testCustomer };

			await Customer.create(testPutCustomer);
		
			req.body = customers[0];
			req.method = 'PUT';
			req.query = {
				id: _id,
			};
			await customerHandler(req, res);
			expect(res.statusCode).toEqual(201);
			expect(res._getJSONData().data.customerName).toEqual(customers[0].customerName);
		});

		it('Can delete a customer', async () => {
			const _id = '61b1b528348333e470fd8c99';
			const testDeleteCustomer = { _id, ...testCustomer };

			await Customer.create(testDeleteCustomer);
      
			req.method = 'DELETE';
			req.query = {
				id: _id,
			};

			await customerHandler(req, res);
			const customer = await Customer.findById(_id);
			expect(res.statusCode).toEqual(204);
			expect(customer).toEqual(null);
		});

		it('Can fetch the list of guilds the currently signed in user belongs to', async () => {
			await Customer.insertMany(customers);
			req.method = 'POST';
			req.body = { guilds };
			await userCustomerHandler(req, res);
			expect(res._getJSONData().items.length).toEqual(4);
		});
	});

	describe('Unhappy paths', () => {
		it('Rejects empty customer create', async () => {
			req.method = 'POST';
			req.body = {};
			await customersHandler(req, res);
			expect(res.statusCode).toEqual(400);
		});

		it('Rejects customer with unknown fields in POST', async () => {
			req.body = { ...testCustomer, not: 'a field' };
			req.method = 'POST';
			await customersHandler(req, res);
			expect(res.statusCode).toEqual(400);
		});

		it('Rejects customer with missing fields in POST', async () => {
			const { customerName, ...rest } = testCustomer;
			req.method = 'POST';
			req.body = rest;
			await customersHandler(req, res);
			expect(res.statusCode).toEqual(400);
			// typescript supress
			customerName;
		});

		it('Rejects a partial edit in PUT', async () => {
			const _id = '61b1b528348333e470fd8c99';
			const testPatchCustomer = { _id, ...testCustomer };
			await Customer.create(testPatchCustomer);
			req.body = { customer_id: 'change this' };
			req.method = 'PUT';
			req.query = {
				id: _id,
			};
			await customerHandler(req, res);
			expect(res.statusCode).toEqual(400);
		});

		it('Rejects editing a nested property without specifying all fields for discord ids', async () => {
			const _id = '61b1b528348333e470fd8c99';
			const testPatchCustomer = { _id, ...testCustomer };
			await Customer.create(testPatchCustomer);
			req.body = { createdBy: { discordHandle: 'Missing discord Id' } };
			req.method = 'PUT';
			req.query = {
				id: _id,
			};
			await customerHandler(req, res);
			expect(res.statusCode).toEqual(400);
			req.body = { claimedBy: { discordId: 'Missing discord handle' } };
			await customerHandler(req, res);
			expect(res.statusCode).toEqual(400);
		});

		it('Rejects and invalid id string, for all routes', async () => {
			const _id = '61b1b528348333e470fd8c99';
			const testCustomerWithId = { _id, ...testCustomer };
			await Customer.create(testCustomerWithId);

			req.query = {
				id: '999999999999999999999999',
			};
			req.method = 'GET';
			await customerHandler(req, res);
			expect(res.statusCode).toEqual(404);

			req.method = 'PUT';
			req.body = testCustomer;
			await customerHandler(req, res);
			expect(res.statusCode).toEqual(404);

			req.method = 'DELETE';
			await customerHandler(req, res);
			expect(res.statusCode).toEqual(404);
		});

		it('Pagination', async () => {
			jest.fn();
		});
	});
});