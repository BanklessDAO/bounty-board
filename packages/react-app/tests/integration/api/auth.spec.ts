import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, MockResponse, MockRequest } from 'node-mocks-http';
import { Connection } from 'mongoose';
import dbConnect from '@app/utils/dbConnect';
import roleHandler from '@app/pages/api/auth/roles';
import RoleCache, { IRoleCache } from '@app/models/RoleCache';
import * as service from '@app/services/auth.service';
import * as nextAuth from 'next-auth/react';
import { SessionWithToken } from '@app/types/SessionExtended';
import { BANKLESS } from '@app/constants/Bankless';

const customerId = BANKLESS.customerId;

describe('Testing the Role Caching', () => {
	let connection: Connection;
	let req: MockRequest<NextApiRequest>;
	let res: MockResponse<NextApiResponse>;

	const mockSession: SessionWithToken = {
		accessToken: 'TESTTESTTEST',
		expires: new Date().toDateString(),
		user: {
			email: 'test@test.com',
			name: 'Jordan',
		},
	};

	const altMockSession: SessionWithToken = {
		...mockSession,
		user: {
			email: 'notTest@not.test.com',
			name: 'notJordan',
		},
	};

	let [spy]: jest.SpyInstance[] = [];

	beforeAll(async () => {
		const connect = await dbConnect();
		connection = connect.connections[0];
	});

	afterAll(async () => {
		await connection.close();
	});

	beforeEach(() => {
		spy = jest.spyOn(service, 'getPermissions').mockResolvedValue(['admin']);
		jest.spyOn(nextAuth, 'getSession').mockResolvedValue(mockSession);
		const output = createMocks();
		req = output.req;
		req.method = 'GET';
		req.query.customerId = BANKLESS.customerId;
		res = output.res;
	});

	afterEach(async () => {
		jest.clearAllMocks();
		await RoleCache.deleteMany();
	});

	it('Grabs the role from discord if we do not have a cached role', async () => {
		await roleHandler(req, res);
		expect(res.statusCode).toEqual(200);
		expect(res._getJSONData().data.roles).toEqual(['admin']);
		expect(spy).toHaveBeenCalled();
	});

	it('Creates a cache record in the DB', async () => {
		await roleHandler(req, res);
		const roleCache = await RoleCache.find();
		expect(roleCache.length).toEqual(1);
	});

	it('Uses the cached record second time around', async () => {
		await roleHandler(req, res);
		await roleHandler(req, res);
		const roleCache = await RoleCache.find();
		expect(roleCache.length).toEqual(1);
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('Creates a different cache record if the user changes', async () => {
		jest.spyOn(nextAuth, 'getSession').mockResolvedValueOnce(mockSession);
		await roleHandler(req, res);

		jest.spyOn(nextAuth, 'getSession').mockResolvedValueOnce(altMockSession);
		await roleHandler(req, res);

		const roleCache = await RoleCache.find();
		expect(roleCache.length).toEqual(2);
		expect(spy).toHaveBeenCalledTimes(2);
	});

	it('Creates a different cache record if the customer changes', async () => {
		jest.spyOn(nextAuth, 'getSession').mockResolvedValueOnce(mockSession);
		await roleHandler(req, res);

		req.query.customerId = 'NEW ID';
		await roleHandler(req, res);

		const roleCache = await RoleCache.find();
		expect(roleCache.length).toEqual(2);
		expect(spy).toHaveBeenCalledTimes(2);
	});

	it('Invalidates the cache if the cache expires', async () => {
		// create a cache record
		const cacheExpired: IRoleCache = {
			createdAt: new Date().getTime() - service.FIVE_MINUTES - 1,
			roles: ['admin'],
			sessionHash: service.createSessionHash(mockSession),
			customerId,
			tte: service.FIVE_MINUTES,
		};
		await RoleCache.create(cacheExpired);

		spy = jest
			.spyOn(service, 'getPermissions')
			.mockResolvedValue(['create-customer']);

		await roleHandler(req, res);
		const roleCache = await RoleCache.find();
		expect(roleCache.length).toEqual(1);
		expect(spy).toHaveBeenCalledTimes(1);
		expect(res._getJSONData().data.roles).toEqual(['create-customer']);
	});

	it('Flushes all cache records that are older than 10 minutes', async () => {
		const cacheExpired: IRoleCache = {
			createdAt: new Date().getTime() - service.FIVE_MINUTES - 1,
			roles: ['admin'],
			customerId,
			sessionHash: service.createSessionHash(mockSession),
			tte: service.FIVE_MINUTES,
		};
		const cacheStale = {
			...cacheExpired,
			createdAt: new Date().getTime() - service.FIVE_MINUTES * 2,
		};
		const cacheOkay = {
			...cacheExpired,
			createdAt: new Date().getTime() - 100,
		};

		await RoleCache.create([cacheExpired, cacheOkay, cacheStale]);

		await roleHandler(req, res);

		const roleCache = await RoleCache.find();
		expect(roleCache.length).toEqual(2);
	});

	it('Throws an error if we are missing a customer id', async () => {
		req.query.customerId = undefined;

		await roleHandler(req, res);
		expect(res.statusCode).toEqual(400);
	});

	it('Returns a 200 if the session object is empty', async () => {
		jest.spyOn(nextAuth, 'getSession').mockResolvedValue(null);

		await roleHandler(req, res);
		expect(res.statusCode).toEqual(200);
		expect(res._getJSONData().data.roles).toEqual([]);
	});
});
