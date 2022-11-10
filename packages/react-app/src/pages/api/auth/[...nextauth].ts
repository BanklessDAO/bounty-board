import { SessionWithToken } from '@app/types/SessionExtended';
import NextAuth, { Session, TokenSet } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

// type AuthURLProps = { url: string, scopes: string[] };
export const DISCORD_AUTH_SETTINGS = {
	url: 'https://discord.com/api/oauth2/authorize?scope=',
	scopes: ['identify', 'email', 'guilds', 'guilds.join', 'guilds.members.read'],
};

export const getAuthUrl = ({
	url,
	scopes,
}: {
  url: string;
  scopes: string[];
}): string => scopes.reduce((prev, curr) => `${prev}+${curr}`, url);

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
			authorization: getAuthUrl(DISCORD_AUTH_SETTINGS),
		}),
	],
	callbacks: {
		async jwt({ token, account }: any) {
			if (account) {
				// token.profile = profile;
				token.accessToken = account.access_token;
				token.refreshToken = account.refresh_token;
			}
			return token;
		},
		async session({
			session,
			token,
		}: {
      session: Session;
      token: TokenSet;
    }): Promise<SessionWithToken> {
			// Send properties to the client, like access_token from a provider.
			session.accessToken = token.accessToken;
			return session as SessionWithToken;
		},
	},
});
