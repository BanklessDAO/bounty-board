import { BountyCollection, BountySchema } from '../../../../../src/models/Bounty';
import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, MockRequest, MockResponse } from 'node-mocks-http';
import { handler } from '../../../../../src/pages/api/bounties/[id]';
import * as service from '../../../../../src/services/bounty.service';
import { testBounty } from '../../../../stubs/bounty.stub';
import validate from '../../../../../src/middlewares/validate';
import ServiceUtils from '../../../../../src/utils/ServiceUtils';

// Prevent code from firing on import by mocking the whole module
jest.mock('../../../../../src/utils/dbConnect', () => ({
	__esModule: true,
	default: jest.fn(),
}));


describe('Testing the bounty API handler', () => {
	let req: MockRequest<NextApiRequest>;
	let res: MockResponse<NextApiResponse>;
  
	beforeEach(() => {
		const output = createMocks();
    
		req = output.req;
		res = output.res;
		req.query = { id: 'TEST' };

		jest.spyOn(service, 'getBounty')
			.mockReturnValue(Promise.resolve({} as BountyCollection));
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('Fetches the bounty if a GET request returns a result', async () => {
		await handler(req, res);
		expect(res.statusCode).toEqual(200);
	});

	it('Responds with a not found if the bountyId does not exist', async () => {
		jest.spyOn(service, 'getBounty')
			.mockReturnValue(Promise.resolve(null));
    
		await handler(req, res);
		expect(res.statusCode).toEqual(404);
	});

	it('Throws an error if the patch request cannot be edited', async () => {
		jest.spyOn(ServiceUtils, 'canBeEdited')
			.mockReturnValue(false);
    
		req.method = 'PATCH';
		await handler(req, res);

		expect(res.statusCode).toEqual(400);
	});

	it('Edits if the patch request can be edited', async () => {
		jest.spyOn(ServiceUtils, 'canBeEdited')
			.mockReturnValue(true);
		jest.spyOn(service, 'editBounty')
			.mockReturnValue(Promise.resolve({} as BountyCollection));
    
		req.method = 'PATCH';
		await handler(req, res);
		expect(res.statusCode).toEqual(200);
	});

	it('Edits if the patch request includes a FORCE option', async () => {
		jest.spyOn(ServiceUtils, 'canBeEdited')
			.mockReturnValue(false);
		jest.spyOn(service, 'editBounty')
			.mockReturnValue(Promise.resolve({} as BountyCollection));
    
		req.method = 'PATCH';
		req.query.force = 'true';
		await handler(req, res);
		expect(res.statusCode).toEqual(200);
	});

});

describe('Testing validations for single bounties', () => {
	let [req, res] = [] as unknown as [NextApiRequest, any];
	const mockHandler = (rq: NextApiRequest, rs: NextApiResponse) => {
		rq;
		rs;
	};
	const mockBountyValidator = validate({ schema: BountySchema, handler: mockHandler });
	beforeEach(() => {
		const output = createMocks();
		req = output.req;
		res = output.res;
		req.method = 'PATCH';
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('Rejects an empty bounty', async () => {
		await mockBountyValidator(req, res);
		expect(res.statusCode).toEqual(400);
	});

	it('Accepts an edit for a partial bounty', async () => {
		const { reward, ...rest } = testBounty;
		req.body = { reward };
		await mockBountyValidator(req, res);
		// expect(res._getJSONData()).toEqual('');
		expect(res.statusCode).toEqual(200);
		// make ts chill out:
		rest;
	});

	it('Rejects an edit for an incorrect bounty', async () => {
		req.body = { this: 'shouldFail' };
		await mockBountyValidator(req, res);
		expect(res.statusCode).toEqual(400);
	});
});