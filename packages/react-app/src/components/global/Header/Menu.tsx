import ThemeToggle from '../../parts/ThemeToggle';
import AccessibleLink from '../../parts/AccessibleLink';
import { DAOSelector } from './DAOSelector';
import { getCustomersInUsersGuilds } from '../../../pages/api/customer/customer.service';
import { useSession } from 'next-auth/client';
import React, { useEffect, useState } from 'react';
import { Button, Box, Text, Stack, useColorModeValue } from '@chakra-ui/react';
import { RiMenuFill, RiCloseFill } from 'react-icons/ri';
import { Customer } from '../../../types/Customer';
import { toggleDiscordSignIn } from '../../../pages/api/auth/discord';

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
	customer: Customer;
	setCustomer(customer: Customer): void;
}

export const MenuLinks = ({
	isOpen,
	customer,
	setCustomer,
}: MenuLinksProps): JSX.Element => {

	const [session, loading] = useSession();
	const [customers, setCustomers] = useState<Customer[]>();

	useEffect(() => {
		// get list of customers and set the currently active customer
		if (session) {
			getCustomersInUsersGuilds().then((res: Customer[]) => {
				setCustomers(res);
				setCustomer(res[0]);
			});
		}
	}, [session]);

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
				{ customers
					? <DAOSelector
						customers={customers}
						customer={customer}
						setCustomer={setCustomer}
					/>
					: null
				}
				<MenuItem newTab={false} >
					{
						loading
							? <span>Loading...</span>
							: <Button
								onClick={
									() => toggleDiscordSignIn(session, setCustomers)
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