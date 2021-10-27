import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		DiscordProvider({
			clientId: '892232488812965898',
			clientSecret: 'IB33yqHzgiG4VhFxr6cB0Tr5oEAnihmq',
			scope: 'identify guilds',
		}),
	],
});