import ThemeToggle from '../../parts/ThemeToggle';
import AccessibleLink from '../../parts/AccessibleLink';
import { DAOSelector } from './DAOSelector';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { Button, Box, Text, Stack, useColorModeValue } from '@chakra-ui/react';
import { RiMenuFill, RiCloseFill } from 'react-icons/ri';
import { CustomerProps } from '../../../models/Customer';
import { toggleDiscordSignIn } from '../../../services/discord.service';
import { BANKLESS } from '../../../constants/Bankless';
import useSWR from 'swr';
import { DiscordGuild } from '../../../types/Discord';
import axios from 'axios';

const CloseIcon = ({ color }: { color: string }) => (
	<RiCloseFill size="2.7em" color={color} />
);
const MenuIcon = ({ color }: { color: string }) => (
	<RiMenuFill size="2.5em" color={color} />
);

interface MenuItemProps {
  children?: React.ReactNode
  isLast?: boolean
  newTab?: boolean
}

const MenuItem = ({ children, newTab, ...rest }: MenuItemProps): JSX.Element => (
	<AccessibleLink href='/' isExternal={newTab}>
		<Text display="block" {...rest}>
			{children}
		</Text>
	</AccessibleLink>
);

interface MenuToggleProps {
  toggle: VoidFunction
  isOpen: boolean
}

export const MenuToggle = ({ toggle, isOpen }: MenuToggleProps): JSX.Element => {
	const fgColor = useColorModeValue('black', 'white');
	return (
		<Box display={{ base: 'block', md: 'none' }} onClick={toggle}>
			{isOpen
				? <CloseIcon color={fgColor} />
				: <MenuIcon color={fgColor} />
			}
		</Box>
	);
};
interface MenuLinksProps {
	isOpen: boolean;
}

const tokenFetcher = (url: string, token: string) => axios.get(
	url,
	{
		headers: {
			authorization: `Bearer ${token}`,
		},
	}
).then(res => res.data).catch(error => console.warn(error));

export const MenuLinks = ({ isOpen }: MenuLinksProps): JSX.Element => {

	const { data: session, status } = useSession({ required: false });
	const [customers, setCustomers] = useState<CustomerProps[]>([BANKLESS]);
	const [guilds, setGuilds] = useState<DiscordGuild[]>();

	const { data: guildApiResponse, error } = useSWR<DiscordGuild[], unknown>(
		session
			? ['https://discord.com/api/users/@me/guilds', session.accessToken]
			: null
		, tokenFetcher
	);

	if (error) console.warn('Unable to fetch guilds for the current user, ensure the permissions are correctly set');

	useEffect(() => {
		const guildsExist = guildApiResponse && (guildApiResponse.length > 0);
		if(session && guildsExist) setGuilds(guildApiResponse);
	}, [guildApiResponse]);

	useEffect(() => {
		// better to move this to a use swr hook with defaults and trigger/mutate
		if (session && guilds) {
			axios.post('/api/customers/user', { guilds })
				.then(({ data: res }) => setCustomers(res.data))
				.catch(() => console.warn('There was a problem fetching the user\'s guilds from the bountyboard server'));
		}
	}, [session, guilds]);

	return (
		<Box
			display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
			flexBasis={{ base: '100%', md: 'auto' }}
		>
			<Stack
				spacing={4}
				align="center"
				justify={{ base: 'center', sm: 'space-between', md: 'flex-end' }}
				direction={{ base: 'column', md: 'row' }}
			>
				{ customers && session
					? <DAOSelector
						customers={customers}
					/>
					: null
				}
				<MenuItem newTab={false} >
					{
						status === 'loading'
							? <span>Loading...</span>
							: <Button
								onClick={
									() => toggleDiscordSignIn(session)
								}
								id='DiscordButton'
							>
								{ session ? session.user?.name : 'Join DAO'}
							</Button>
					}
				</MenuItem>
				<ThemeToggle />
			</Stack>
		</Box>
	);
};