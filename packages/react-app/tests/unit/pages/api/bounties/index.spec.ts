import { BountySchema } from '../../../../../src/models/Bounty';
import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import { testBounty } from '../../../../stubs/testBounty';
import { testBountyPartial } from '../../../../stubs/testBountyPartial';
import validate from '../../../../../src/middlewares/validate';

describe('Testing POST bounty validation', () => {
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
		req.method = 'POST';
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('Rejects an empty bounty', async () => {
		await mockBountyValidator(req, res);
		expect(res.statusCode).toEqual(400);
	});

	it('Accepts a complete bounty', async () => {
		req.body = testBounty;
		await mockBountyValidator(req, res);
		// expect(res._getJSONData()).toEqual('');
		expect(res.statusCode).toEqual(200);
	});

	it('Rejects an incomplete bounty', async () => {
		req.body = testBountyPartial;
		await mockBountyValidator(req, res);
		expect(res.statusCode).toEqual(400);
	});

	it('Rejects extraneous missing fields', async () => {
		req.body = { ...testBounty, this: 'shouldFail' };
		await mockBountyValidator(req, res);
		expect(res.statusCode).toEqual(400);
	});
});