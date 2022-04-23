import { BountyCollection } from '../models/Bounty';
import useSWR from 'swr';
import axios from '../utils/AxiosUtils';
import { useContext, useMemo } from 'react';
import { CustomerContext } from '@app/context/CustomerContext';

// axios returns an AxiosResponse, with the payload in the `data` object
const axiosFetcher = (url: string) => axios.get(url).then(({ data }) => data.data);

interface BountySWRResponse {
	isLoading: boolean;
	isError: boolean;
}

interface useBountiesResponse extends BountySWRResponse {
	bounties?: BountyCollection[]
}

interface useBountyResponse extends BountySWRResponse {
	bounty?: BountyCollection
}

export function useBounties(url: string, ready = true): useBountiesResponse {
	/**
   * Wraps the SWR hook with additional loading state for spinners
   * Optioanlly pass a `ready` param to delay execution.
   */
	const { data, error } = useSWR<BountyCollection[], unknown>(ready ? url : null, axiosFetcher);
	return {
		bounties: data,
		isLoading: !error && !data,
		isError: !!error,
	};
}

export function useBounty(id?: string | string[]): useBountyResponse {
	const { customer } = useContext(CustomerContext);
	const { data, error } = useSWR<BountyCollection, unknown>(
		id
			? `/api/bounties/${id}`
			: null,
		axiosFetcher
	);
	const mismatchedBounty = useMemo(() => {
		return customer && data && customer.customerId !== data.customerId;
	}, [customer, data]);

	if (typeof id !== 'string' || mismatchedBounty) {
		return {
			bounty: undefined,
			isLoading: false,
			isError: true,
		};
	}

	return {
		bounty: data,
		isLoading: !error && !data,
		isError: !!error,
	};
}

export default useBounties;