import { CustomerContext } from '@app/context/CustomerContext';
import { axiosFetcher } from '@app/utils/AxiosUtils';
import { useContext } from 'react';
import useSWR from 'swr';

export const useTags = (): string[] => {
	/**
   * Get the tags in use for this customer's bounties
   */
	const { customer } = useContext(CustomerContext);
	const { data, error } = useSWR<{ tags: string[] }, unknown>(
		customer.customerId
			? `/api/bounties/tags?customerId=${customer.customerId}`
			: null,
		axiosFetcher
	);
	if (error) {
		console.warn(error);
		return [];
	}
	return (data && data.tags) ?? [];
};
