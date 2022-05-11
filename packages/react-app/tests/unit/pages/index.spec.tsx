import React from 'react';
import { shallow } from 'enzyme';
import * as router from 'next/router';
import * as bountyHooks from '@app/hooks/useBounties';
import * as customerHooks from '@app/hooks/useCustomer';
import Bounties, { FilterResultPlaceholder } from '@app/components/pages/Bounties';
import { NextRouter } from 'next/router';
import { BountyCollection } from '@app/models/Bounty';
import { BountySummary } from '@app/components/pages/Bounties/Bounty';
import { customers } from '@tests/stubs/customers.stub';

const CUSTOMERNAME = 'Test';
const CUSTOMERID = '1';

jest.mock('@app/components/pages/Bounties', () => {
	return jest.fn(() => null);
});

jest.mock('@app/components/global/SiteLayout', () => {
	return jest.fn(() => null);
});

describe('Testing the bounty listing page', () => {
	beforeEach(() => {
		jest.spyOn(customerHooks, 'useCustomerFromBountyIdAndKey').mockReturnValue(customers[0]);

		jest.spyOn(router, 'useRouter').mockImplementation(() => ({
			query: {
				id: '1',
			},
		}) as unknown as NextRouter);

		jest.spyOn(React, 'useContext').mockImplementation(() => ({
			customer: {
				customerName: CUSTOMERNAME,
				customerId: CUSTOMERID,
			},
		}));
	});

	it('Shows the loading page if loading', () => {
		jest.spyOn(bountyHooks, 'useBounties').mockImplementation(() => ({
			isLoading: true,
			isError: false,
			bounties: undefined,
		}));
		const wrapper = shallow(<Bounties />);
		expect(wrapper.containsMatchingElement(<FilterResultPlaceholder message={'Loading'} />)).toEqual(true);
	});

	it('Shows No Results message', () => {
		jest.spyOn(bountyHooks, 'useBounty').mockImplementation(() => ({
			isLoading: false,
			isError: true,
			bounty: undefined,
		}));
		const wrapper = shallow(<Bounties />);
		expect(wrapper.containsMatchingElement(<FilterResultPlaceholder message={'No Results'} />)).toEqual(true);
	});

	it('Otherwise renders the bounty list', () => {
		jest.spyOn(bountyHooks, 'useBounties').mockImplementation(() => ({
			isLoading: false,
			isError: false,
			bounties: [
				{ _id: '1' },
				{ _id: '2' },
			] as unknown as BountyCollection[],
		}));

		const wrapper = shallow(<Bounties />);
		expect(wrapper.containsMatchingElement(<FilterResultPlaceholder message={'Loading'} />)).toEqual(false);
		expect(wrapper.containsMatchingElement(<FilterResultPlaceholder message={'No Results'} />)).toEqual(false);
		expect(wrapper.containsMatchingElement(
			<BountySummary bounty={{ _id: '1' } as BountyCollection} />
		)).toEqual(true);
		expect(wrapper.containsMatchingElement(
			<BountySummary bounty={{ _id: '2' } as BountyCollection} />
		)).toEqual(true);
	});
});