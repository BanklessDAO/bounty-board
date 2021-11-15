import { Session } from 'next-auth';
import { toggleDiscordSignIn } from '../../../src/services/discord.service';
import * as client from 'next-auth/react';

jest.mock('next-auth/react', () => ({
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
		toggleDiscordSignIn(undefined);
		expect(spySignIn).toHaveBeenCalled();
	});
  
	it('Signs the user out if called when the user is already logged in', () => {
		const sessionTrue: Session = { expires: 'Sometime' };
		toggleDiscordSignIn(sessionTrue);
		expect(spySignOut).toHaveBeenCalled();
	});
});