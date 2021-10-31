import { Session } from 'next-auth';
import { toggleDiscordSignIn } from '../../../src/services/discord.service';
import * as customerService from '../../../src/services/customer.service';
import * as client from 'next-auth/client';
import { customers } from '../../stubs/customers.stub';

jest.mock('next-auth/client', () => ({
	signIn: jest.fn(),
	signOut: jest.fn(),
}));

const spySignOut = jest.spyOn(client, 'signOut');
const spySignIn = jest.spyOn(client, 'signIn');

describe('Testing the discord service', () => {

	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('Signs the user in if the session is not there', () => {
		const spyGetCustomers = jest
			.spyOn(customerService, 'getCustomersInUsersGuilds')
			.mockImplementation(() => Promise.resolve(customers));
    
		toggleDiscordSignIn(undefined);

		expect(spySignIn).toHaveBeenCalled();
		expect(spyGetCustomers).toHaveBeenCalled();
	});
  
	it('Signs the user out if called when the user is already logged in', () => {
		const sessionTrue: Session = { expires: 'Sometime' };
		toggleDiscordSignIn(sessionTrue);
		expect(spySignOut).toHaveBeenCalled();
	});
});