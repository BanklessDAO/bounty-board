import { BANKLESS } from '@app/constants/Bankless';
import { SetCustomerType } from '@app/context/CustomerContext';
import { BountyCollection } from '@app/models/Bounty';
import { CustomerProps } from '@app/models/Customer';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url)
	.then(res => res.json())
	.then(json => json.data);

export const useCustomerFromBountyId = (bountyId: string | string[] | undefined): CustomerProps | undefined => {
	/**
		 * Chain useSWR hooks into a single function to fetch the customer, corresponding to the passed bounty id.
		 * @param bountyId will have an associated customerId, which is then used to fetch the customer.
		 * @returns the fetched customer, or undefined if either the bountyId is undefined or the customer is undefined.  
		 */
	const { data: bounty } = useSWR<BountyCollection>(
		typeof bountyId === 'string' ? `/api/bounties/${bountyId}` : null,
		fetcher
	);
	const { data: customer } = useSWR<CustomerProps>(
		bounty ? `/api/customers/${bounty.customerId}` : null,
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

export const useCustomer = (id: string | string[] | undefined): {
	customer: CustomerProps,
	setCustomer: SetCustomerType
} => {
	const [customer, setCustomer] = useState<CustomerProps>(BANKLESS);
	const customerFromId = useCustomerFromBountyId(id);

	useEffect(() => {
		setCustomerFromLocalStorage(setCustomer);
	}, []);

	useEffect(() => {
		if (customerFromId) setCustomer(customerFromId);
	}, [customerFromId]);

	return {
		customer, setCustomer,
	};
};