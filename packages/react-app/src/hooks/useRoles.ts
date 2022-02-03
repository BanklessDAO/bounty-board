import { Role } from '@app/types/Role';
import { axiosFetcher } from '@app/utils/AxiosUtils';
import useSWR from 'swr';

export const useRoles = (): Role[] => {
	/**
   * This hook is where we can call an API and return the user's roles
	 * We will probably want to pass in the user at some stage, although currently
	 * we only use discord roles, so can use the getSession method on the server side
	 * Note, we currently only support roles in bankless, and need to establish a more complete
	 * Auth method for multitenancy
   */
	const { data, error } = useSWR<{ roles: Role[] }, unknown>(
		'/api/auth/roles',
		axiosFetcher,
	);
	if (error) {
		console.warn(error);
		return [];
	}
	return (data && data.roles) ?? [];
};