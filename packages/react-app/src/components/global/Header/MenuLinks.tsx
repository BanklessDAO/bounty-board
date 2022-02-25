import React, { useEffect, useState } from 'react';
import AccessibleLink from '../../parts/AccessibleLink';
import { Button, Text } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { CustomerProps } from '../../../models/Customer';
import { BANKLESS } from '../../../constants/Bankless';
import { DiscordGuild } from '../../../types/Discord';
import axios from 'axios';
import useSWR from 'swr';
import NewBounty from './NewBounty';
import { DAOSelector } from './DAOSelector';
import { toggleDiscordSignIn } from '../../../services/discord.service';

interface MenuItemProps {
  children?: React.ReactNode;
  isLast?: boolean;
  newTab?: boolean;
}

const MenuItem = ({
	children,
	newTab,
	...rest
}: MenuItemProps): JSX.Element => (
	<AccessibleLink href="/" isExternal={newTab}>
		<Text display="block" {...rest}>
			{children}
		</Text>
	</AccessibleLink>
);

export const tokenFetcher = (url: string, token: string): any =>
	axios
		.get(url, {
			headers: {
				authorization: `Bearer ${token}`,
			},
		})
		.then((res) => res.data)
		.catch((error) => console.warn(error));

export const MenuLinks = () => {
	const { data: session, status } = useSession({ required: false });
	const [customers, setCustomers] = useState<CustomerProps[]>([BANKLESS]);
	const [guilds, setGuilds] = useState<DiscordGuild[]>();

	const { data: guildApiResponse, error } = useSWR<DiscordGuild[], unknown>(
		session
			? ['https://discord.com/api/users/@me/guilds', session.accessToken]
			: null,
		tokenFetcher
	);

	if (error) {
		console.warn(
			'Unable to fetch guilds for the current user, ensure the permissions are correctly set'
		);
	}

	useEffect(() => {
		const guildsExist = guildApiResponse && guildApiResponse.length > 0;
		if (session && guildsExist) setGuilds(guildApiResponse);
	}, [guildApiResponse]);

	useEffect(() => {
		// better to move this to a use swr hook with defaults and trigger/mutate
		if (session && guilds) {
			axios
				.post('/api/customers/user', { guilds })
				.then(({ data: res }) => setCustomers(res.data))
				.catch(() =>
					console.warn(
						'There was a problem fetching the user\'s guilds from the bountyboard server'
					)
				);
		}
	}, [session, guilds]);
	return (
		<>
			{<DAOSelector customers={customers} />}
			<MenuItem newTab={false}>
				{status === 'loading' ? (
					<span>Loading...</span>
				) : (
					<Button
						onClick={() => toggleDiscordSignIn(session)}
						id="DiscordButton"
						w={{ base: '20em', md: 'auto' }}
						h={{ base: '3em', md: '2.6em' }}
					>
						{session ? session.user?.name : 'Join DAO'}
					</Button>
				)}
			</MenuItem>
			<NewBounty />
		</>
	);
};
