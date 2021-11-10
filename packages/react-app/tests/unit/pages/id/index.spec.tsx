import BountyPage from '../../../../src/pages/[id]';
import React from 'react';
import { mount } from 'enzyme';
import * as router from 'next/router';
import { NextRouter } from 'next/router';
import Layout from '../../../../src/components/global/SiteLayout';

jest.mock('../../../../src/components/pages/Bounties', () => {
	return jest.fn(() => null);
});

jest.mock('../../../../src/components/global/SiteLayout', () => {
	return jest.fn(() => null);
});

describe('Testing the bounty id page', () => {

	const customerName = 'Test';

	it('Renders with the correct customer name', () => {
		jest.spyOn(router, 'useRouter').mockImplementation(() => ({
			query: {
				id: '1',
			},
		}) as unknown as NextRouter);

		jest.spyOn(React, 'useContext').mockImplementation(() => ({
			customer: {
				customerName,
			},
		}));

		mount(<BountyPage />);

		expect(Layout)
			.toHaveBeenCalledWith(
				expect.objectContaining({ title: `${customerName} Bounty Board` })
				, {}
			);
	});
});