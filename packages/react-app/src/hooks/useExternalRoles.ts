import { CustomerContext } from '@app/context/CustomerContext';
import { axiosFetcher } from '@app/utils/AxiosUtils';
import { useContext } from 'react';
import useSWR from 'swr';

export const useExternalRoles = (): string[] => {
	/**
   * Get the external roles (i.e. Discord roles) for the current user in the current customer/guild
   */
	const { customer } = useContext(CustomerContext);
	const { data, error } = useSWR<{ externalRoles: string[] }, unknown>(
		customer.customerId
			? `/api/auth/external-roles?customerId=${customer.customerId}`
			: null,
		axiosFetcher
	);
	if (error) {
		console.warn(error);
		return [];
	}
	return (data && data.externalRoles) ?? [];
};
