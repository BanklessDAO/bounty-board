import { Session } from 'next-auth';
import { toggleDiscordSignIn } from '../../../src/services/discord.service';
import * as client from 'next-auth/react';
import { DISCORD_AUTH_SETTINGS, getAuthUrl } from '../../../src/pages/api/auth/[...nextauth]';

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

	it('Correctly concatenates permissions into an auth url', () => {
		const expectedUrl = 'https://discord.com/api/oauth2/authorize?scope=+identify+email+guilds+guilds.join';
		expect(getAuthUrl(DISCORD_AUTH_SETTINGS)).toEqual(expectedUrl);
	});
});