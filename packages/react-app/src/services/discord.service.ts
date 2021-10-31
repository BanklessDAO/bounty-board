import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/client';

export const toggleDiscordSignIn = (
	session: Session | unknown,
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
	}
};
