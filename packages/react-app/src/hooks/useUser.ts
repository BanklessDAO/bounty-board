import { SavedQuery } from '@app/types/SavedQuery';
import { axiosFetcher, axiosTokenFetcher } from '@app/utils/AxiosUtils';
import { APIUser } from 'discord-api-types';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export const useUser = (): {
  loading: boolean;
  user?: APIUser;
  error?: any;
  loadingQueries?: boolean;
  savedQueries?: SavedQuery[] | undefined;
} => {
	const { data: session } = useSession({ required: false });
	const { data: user, error } = useSWR<APIUser, unknown>(
		session ? ['https://discord.com/api/users/@me', session.accessToken] : null,
		axiosTokenFetcher
	);
	const { data: savedQueries, error: queryErrors } = useSWR<SavedQuery[]>(
		user ? `/api/savedQuery?discordId=${user.id}` : null,
		axiosFetcher
	);
	return {
		loading: !error && !user,
		user,
		error,
		savedQueries,
		loadingQueries: !queryErrors && !savedQueries,
	};
};
