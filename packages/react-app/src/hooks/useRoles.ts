import { Role } from '@app/types/Role';
import { User } from 'next-auth';

export const useRoles = (user: User): Role[] => {
	/**
   * This hook is where we can call an API and return the user's roles
   */
	user;
	console.warn('Calling a hook that has yet to be implemented');
	return [];
};