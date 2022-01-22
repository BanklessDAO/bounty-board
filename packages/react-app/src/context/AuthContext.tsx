import React, { createContext } from 'react';
import { Role } from '@app/types/Role';
import { useRoles } from '@app/hooks/useRoles';
import { User } from 'next-auth';

type AuthContextProps = {
  roles: Role[];
}
export const AuthContext = createContext<AuthContextProps>({
	roles: [],
});

const AuthContextProvider = (props: { user: User, children: React.ReactNode }): JSX.Element => {
	const roles: Role[] = useRoles(props.user);
	return (
		<AuthContext.Provider value={{ roles }}>
			{ props.children }
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;