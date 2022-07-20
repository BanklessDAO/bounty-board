import { BANKLESS } from '@app/constants/Bankless';
import { SetCustomerType } from '@app/context/CustomerContext';
import { BountyCollection } from '@app/models/Bounty';
import { CustomerProps } from '@app/models/Customer';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url)
	.then(res => res.json())
	.then(json => json.data);

const useCustomerFromBounty = (bountyId: RouterKey): { customer: CustomerProps | undefined, isLoading: boolean } => {

	const { data: bounty, error: bountyError } = useSWR<BountyCollection>(
		typeof bountyId === 'string' ? `/api/bounties/${bountyId}` : null,
		fetcher
	);

	const { data: customer, error: customerError } = useSWR<CustomerProps>(
		bounty ? `/api/customers/${bounty.customerId}` : null,
		fetcher
	);
	return { customer, isLoading: Boolean(bountyId) && ((!bounty && !bountyError) || (!customer && !customerError)) };
};

const useCustomerFromKey = (customerKey: RouterKey): { customer: CustomerProps | undefined, isLoading: boolean } => {
	const { data: customerFromKey, error } = useSWR<CustomerProps[]>(
		customerKey ? `/api/customers?customerKey=${customerKey}` : null,
		fetcher
	);
	const isLoading = Boolean(customerKey) && !customerFromKey && !error ;
	// key passed but no customer
	if (!customerFromKey) return { customer: undefined, isLoading };

	// should only be 1 result 
	if (customerFromKey.length === 0) return { customer: undefined, isLoading };

	return { customer: customerFromKey[0], isLoading };
};

export const useCustomerFromBountyIdAndKey = (bountyId: RouterKey, customerKey: RouterKey): { customer: CustomerProps | undefined, isLoading: boolean } => {
	/**
		 * Chain useSWR hooks into a single function to fetch the customer, corresponding to the passed bounty id.
		 * @param bountyId will have an associated customerId, which is then used to fetch the customer.
		 * @returns the fetched customer, or undefined if either the bountyId is undefined or the customer is undefined.  
		 */
	const { customer: customerFromKey, isLoading: customerFromKeyLoading } = useCustomerFromKey(customerKey);
	const { customer: customerFromBounty, isLoading: customerFromBountyLoading } = useCustomerFromBounty(bountyId);

	// customer name passed but matches no customer on file
	if (customerKey && !customerFromKey) return { customer: undefined, isLoading: customerFromKeyLoading || customerFromBountyLoading };

	// no bounty id passed so just return the customer
	if (!bountyId) return { customer: customerFromKey, isLoading: customerFromKeyLoading || customerFromBountyLoading };

	// bounties found BUT mistmatch customer name
	if (customerFromKey && customerFromBounty?.customerId !== customerFromKey?.customerId) {
		console.log(
			'%cWARNING: Mismatched customer ID and bounty ID',
			'color:red;font-weight:bold;'

		);
		return { customer: undefined, isLoading: customerFromKeyLoading || customerFromBountyLoading };
	}

	return { customer: customerFromBounty, isLoading: customerFromKeyLoading || customerFromBountyLoading };
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
	const { customer: customerFromIdAndKey } = useCustomerFromBountyIdAndKey(id, customerKey);
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