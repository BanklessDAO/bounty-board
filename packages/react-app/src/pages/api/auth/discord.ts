import { Session } from 'next-auth';
import { signIn } from 'next-auth/client';
import { signOut } from 'next-auth/client';
import { Customer } from '../../../types/Customer';
import { getCustomersInUsersGuilds } from '../customer/customer.service';

export const toggleDiscordSignIn = (
	session: Session | unknown,
	setCustomers: (customers: Customer[]) => void
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
