import { profile } from 'console';
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
		async jwt({token, user, account, profile}) {
			// Add auth_time to token on signin in

			if(user) {
			token.profile = profile;
			token.accessToken = account.accessToken;
			token.refreshToken = account.refreshToken;
			}


			console.log("jwt",{account, user})
			return token;
		},
	// 	async session({ session, token, user }) {
	// 	//   // Send properties to the client, like an access_token from a provider.

	// 	//   session.user.accessToken = token.accessToken;
	// 	//   session.user.refreshToken = token.refreshToken;

	// 	//   session.user.profile = token.profile;
	// 	//   console.log("session",{ session, token, user })
	// 	//   const guildsfetch = await fetch('https://discord.com/api/users/@me', {
	// 	// 	headers:  {
	// 	// 		authorization: `Bearer ${token.accessToken}`,
	// 	//   }
	// 	// })
	// 	// const guilds = await guildsfetch.json()
	// 	// session.user.profile.guilds = guilds

	// 	// return session
	// 	// }
	  },
});