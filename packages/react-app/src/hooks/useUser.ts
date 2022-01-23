import { axiosTokenFetcher } from '@app/utils/AxiosUtils';
import { APIUser } from 'discord-api-types';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export const useUser = (): {
  loading: boolean;
  user?: APIUser
} => {
	const { data: session } = useSession({ required: false });
	const { data: user, error } = useSWR<APIUser, unknown>(session
		? ['https://discord.com/api/users/@me', session.accessToken]
		: null
	, axiosTokenFetcher);
	return {
		loading: !error && !user,
		user,
	};
};