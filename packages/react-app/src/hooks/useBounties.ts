import { BountyCollection } from '../models/Bounty';
import useSWR from 'swr';
import axios from '../utils/AxiosUtils';

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

export function useBounties(url: string): useBountiesResponse {
	/**
   * Wraps the SWR hook with additional loading state for spinners
   */
	const { data, error } = useSWR<BountyCollection[], unknown>(url, axiosFetcher);
	return {
		bounties: data,
		isLoading: !error && !data,
		isError: !!error,
	};
}

export function useBounty(id?: string | string[]): useBountyResponse {
	const { data, error } = useSWR<BountyCollection, unknown>(
		id
			? `/api/bounties/${id}`
			: null,
		axiosFetcher
	);
	if (typeof id !== 'string') {
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