import { CustomerContext } from '@app/context/CustomerContext';
import { Role } from '@app/types/Role';
import { axiosFetcher } from '@app/utils/AxiosUtils';
import { useContext } from 'react';
import useSWR from 'swr';

export const useRoles = (): Role[] => {
	/**
   * This hook is where we can call an API and return the user's roles
	 * We will probably want to pass in the user at some stage, although currently
	 * we only use discord roles, so can use the getSession method on the server side
   */
	const { customer } = useContext(CustomerContext);
	const { data: roles, error } = useSWR<Role[], unknown>(
		customer
			? `/api/auth/roles?customer_id=${customer.customer_id}`
			: null,
		axiosFetcher
	);
	console.debug({ roles });
	if (error) {
		console.warn(error);
		return [];
	}
	return roles ?? [];
};