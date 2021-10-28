import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/client';
import { CustomerProps } from '../../../types/Customer';
import { getCustomersInUsersGuilds } from '../customer/customer.service';

export const toggleDiscordSignIn = (
	session: Session | unknown,
	setCustomers: (customers: CustomerProps[]) => void
): void => {
	/**
   * @param session is whether the user is logged in.
   *  If so: log the user out
   *  If not: sign in and get/set the list of available DAOs for the selcto
   */
	if (session) {
		signOut();
	} else {
		signIn('discord');
		getCustomersInUsersGuilds()
			.then(userCustomers => setCustomers(userCustomers));
	}
};
