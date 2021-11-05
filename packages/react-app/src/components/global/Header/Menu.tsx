import ThemeToggle from '../../parts/ThemeToggle';
import AccessibleLink from '../../parts/AccessibleLink';
import { DAOSelector } from './DAOSelector';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { Button, Box, Text, Stack, useColorModeValue } from '@chakra-ui/react';
import { RiMenuFill, RiCloseFill } from 'react-icons/ri';
import { CustomerProps } from '../../../models/Customer';
import { toggleDiscordSignIn } from '../../../services/discord.service';
import { fetcher } from '../../../utils/ApiUtils';
import useSWR from 'swr';

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

export const MenuLinks = ({ isOpen }: MenuLinksProps): JSX.Element => {

	const { data: session, status } = useSession({ required: false });
	const [customers, setCustomers] = useState<CustomerProps[]>();
	const [guilds, setGuilds] = useState(null);
	// error handle
	const { data } = useSWR<CustomerProps[], unknown>(
		session ? '/api/customers/user' : null,
		fetcher
	);
	useEffect(() => {
		if (session) {
			setCustomers(data);

			fetch('https://discord.com/api/users/@me/guilds', {
				headers: {
					authorization: `Bearer ${session.accessToken}`,
				},
			})
				.then(res => res.json())
				.then(res => setGuilds(res));
		}
	}, [session, data]);

	console.log('guilds', { guilds });

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