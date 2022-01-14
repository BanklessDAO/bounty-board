import React from 'react';
import { mount, shallow } from 'enzyme';
import * as router from 'next/router';
import * as hooks from '../../../../src/hooks/useBounties';
import { NextRouter } from 'next/router';
import BountyPageLayout, { BountyLoader, BountyNotFound, BountyPage } from '../../../../src/pages/[id]';
import Layout from '../../../../src/components/global/SiteLayout';
import { BountyCollection } from '../../../../src/models/Bounty';
import { BountyCard } from '../../../../src/components/pages/Bounties/Bounty';

const CUSTOMERNAME = 'Test';

jest.mock('@/components/pages/Bounties', () => {
	return jest.fn(() => null);
});

jest.mock('@/components/global/SiteLayout', () => {
	return jest.fn(() => null);
});

describe('Testing the bounty id page', () => {
	beforeEach(() => {
		jest.spyOn(router, 'useRouter').mockImplementation(() => ({
			query: {
				id: '1',
			},
		}) as unknown as NextRouter);

		jest.spyOn(React, 'useContext').mockImplementation(() => ({
			customer: {
				customerName: CUSTOMERNAME,
			},
		}));
	});

	it('Renders with the correct customer name', () => {
		mount(<BountyPageLayout />);
		expect(Layout)
			.toHaveBeenCalledWith(
				expect.objectContaining({ title: `${CUSTOMERNAME} Bounty Board` })
				, {}
			);
	});

	it('Shows the loading page if loading', () => {
		jest.spyOn(hooks, 'useBounty').mockImplementation(() => ({
			isLoading: true,
			isError: false,
			bounty: undefined,
		}));
		const wrapper = shallow(<BountyPage />);
		expect(wrapper.containsMatchingElement(<BountyLoader />)).toEqual(true);
	});

	it('Shows the error page if error', () => {
		jest.spyOn(hooks, 'useBounty').mockImplementation(() => ({
			isLoading: false,
			isError: true,
			bounty: undefined,
		}));
		const wrapper = shallow(<BountyPage />);
		expect(wrapper.containsMatchingElement(<BountyNotFound />)).toEqual(true);
	});

	it('Shows no error if we dont have a bounty id', () => {
		jest.spyOn(router, 'useRouter').mockImplementation(() => ({
			query: {
				id: undefined,
			},
		}) as unknown as NextRouter);
		jest.spyOn(hooks, 'useBounty').mockImplementation(() => ({
			isLoading: false,
			isError: true,
			bounty: undefined,
		}));
		const wrapper = shallow(<BountyPage />);
		expect(wrapper.containsMatchingElement(<BountyNotFound />)).toEqual(false);
	});

	it('Otherwise renders the bounty', () => {
		jest.spyOn(hooks, 'useBounty').mockImplementation(() => ({
			isLoading: false,
			isError: false,
			bounty: { _id: 'test' } as unknown as BountyCollection,
		}));
		const wrapper = shallow(<BountyPage />);
		expect(wrapper.containsMatchingElement(
			<BountyCard { ...{} as BountyCollection } />
		)).toEqual(true);
	});
});