import { BANKLESS } from '@app/constants/Bankless';
import { SetCustomerType } from '@app/context/CustomerContext';
import { BountyCollection } from '@app/models/Bounty';
import { CustomerProps } from '@app/models/Customer';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url)
	.then(res => res.json())
	.then(json => json.data);

const useCustomerFromBounty = (bountyId: RouterKey): CustomerProps | undefined => {

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

const useCustomerFromKey = (customerKey: RouterKey): CustomerProps | undefined => {
	const { data: customerFromKey } = useSWR<CustomerProps[]>(
		customerKey ? `/api/customers?customerKey=${customerKey}` : null,
		fetcher
	);

	// key passed but no customer
	if (!customerFromKey) return;

	// should only be 1 result 
	if (customerFromKey.length === 0) return;

	return customerFromKey[0];
};

export const useCustomerFromBountyIdAndKey = (bountyId: RouterKey, customerKey: RouterKey): CustomerProps | undefined => {
	/**
		 * Chain useSWR hooks into a single function to fetch the customer, corresponding to the passed bounty id.
		 * @param bountyId will have an associated customerId, which is then used to fetch the customer.
		 * @returns the fetched customer, or undefined if either the bountyId is undefined or the customer is undefined.  
		 */
	const customerFromKey = useCustomerFromKey(customerKey);
	const customerFromBounty = useCustomerFromBounty(bountyId);

	// customer name passed but matches no customer on file
	if (customerKey && !customerFromKey) return;

	// no bounty id passed so just return the customer
	if (!bountyId) return customerFromKey;

	// bounties found BUT mistmatch customer name
	if (customerFromKey && customerFromBounty?.customerId !== customerFromKey?.customerId) {
		console.log(
			'%cWARNING: Mismatched customer ID and bounty ID',
			'color:red;font-weight:bold;'

		);
		return;
	}

	return customerFromBounty;
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

type RouterKey = string | string[] | undefined;

export const useCustomer = (id: RouterKey, customerKey: RouterKey): {
	customer: CustomerProps,
	setCustomer: SetCustomerType,
	error: boolean
} => {
	const [customer, setCustomer] = useState<CustomerProps>(BANKLESS);
	const customerFromIdAndKey = useCustomerFromBountyIdAndKey(id, customerKey);
	const [error, setError] = useState(false);

	useEffect(() => {
		setCustomerFromLocalStorage(setCustomer);
	}, []);

	useEffect(() => {
		if (customerFromIdAndKey) setCustomer(customerFromIdAndKey);
		else setError(true);
	}, [customerFromIdAndKey]);

	return {
		customer, setCustomer, error,
	};
};