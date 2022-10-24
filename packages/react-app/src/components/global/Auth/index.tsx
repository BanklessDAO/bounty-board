import { AuthContext } from '@app/context/AuthContext';
import { Role } from '@app/types/Role';
import { useContext } from 'react';

export const useRequiredRoles = (roles: Role[]): boolean => {
	const { roles: userRoles } = useContext(AuthContext);
	return roles.some((r) => userRoles.includes(r));
};

const RestrictedTo = ({
	roles,
	children,
}: {
  roles: Role[];
  children: React.ReactNode;
}): JSX.Element => {
	/**
   * Higher order component to show/hide display based on RBAC
   * Wrap your regular comonents inside this to apply consistent show/hide functionality
   * across the application
   * @param roles an array of roles that will cause the component to show
   */
	const hasRequiredRole = useRequiredRoles(roles);
	return <>{hasRequiredRole && children}</>;
};

export default RestrictedTo;
