import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		DiscordProvider({
			clientId: '892232488812965898',
			clientSecret: 'IB33yqHzgiG4VhFxr6cB0Tr5oEAnihmq',
			authorization: 'https://discord.com/api/oauth2/authorize?scope=identify+guilds',
		}),
	],
	callbacks: {
		async jwt({token, account}) {
			if(account) {
				//token.profile = profile;
				token.accessToken = account.access_token;
				token.refreshToken = account.refresh_token;
			}

			return token;
		},
		async session({session, token}) {
			// Send properties to the client, like access_token from a provider.
			session.accessToken = token.accessToken
			return session
		}
	},
});