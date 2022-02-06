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
	 * Note, we currently only support roles in bankless, and need to establish a more complete
	 * Auth method for multitenancy
   */
	const { customer } = useContext(CustomerContext);
	const { data, error } = useSWR<{ roles: Role[] }, unknown>(
		customer.customer_id
			? `/api/auth/roles?customerId=${customer.customer_id}`
			: null,
		axiosFetcher,
	);
	if (error) {
		console.warn(error);
		return [];
	}
	return (data && data.roles) ?? [];
};