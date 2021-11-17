import { BANKLESS } from '../constants/Bankless';
import { CustomerProps } from '../models/Customer';
import { createContext, Dispatch, SetStateAction } from 'react';
import useSWR from 'swr';
import { BountyBoardProps } from '../models/Bounty';

type SetCustomerType = Dispatch<SetStateAction<CustomerProps>>;

type CustomerContextProps = {
  customer: CustomerProps;
  setCustomer?: SetCustomerType;
}

const fetcher = (url: string) => fetch(url)
	.then(res => res.json())
	.then(json => json.data);

export const getCustomerFromBountyId = (bountyId: string | string[] | undefined): CustomerProps | undefined => {
	/**
		 * Chain useSWR hooks into a single function to fetch the customer, corresponding to the passed bounty id.
		 * @param bountyId will have an associated customer_id, which is then used to fetch the customer.
		 * @returns the fetched customer, or undefined if either the bountyId is undefined or the customer is undefined.  
		 */
	const { data: bounty } = useSWR<BountyBoardProps>(
		typeof bountyId === 'string' ? `/api/bounties/${bountyId}` : null,
		fetcher
	);
	const { data: customer } = useSWR<CustomerProps>(
		bounty ? `/api/customers/${bounty.customer_id}` : null,
		fetcher
	);
	return customer;
};

export const setCustomerFromLocalStorage = (setCustomer: SetCustomerType): void => {
	/**
	 * Next SSR means that the window object is not available on the server.
	 * This function checks for the existence of the window object, indicating we are client side.
	 * It then sets the customer from local storage if it exists.
	 */
	if (typeof window !== 'undefined') {
		const customer = localStorage.getItem('customer');
		if (customer) setCustomer(JSON.parse(customer));
	}
};

export const CustomerContext = createContext<CustomerContextProps>({
	customer: BANKLESS,
});
