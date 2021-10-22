import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/client';
import { Button, Box, Flex, Text, Stack, useColorModeValue } from '@chakra-ui/react';

import { RiMenuFill, RiCloseFill } from 'react-icons/ri';

import Logo from './Logo';
import ThemeToggle from '../../parts/ThemeToggle';
import AccessibleLink from '../../parts/AccessibleLink';

const CloseIcon = ({ color }: { color: string }) => (
	<RiCloseFill size="2.7em" color={color} />
);
const MenuIcon = ({ color }: { color: string }) => (
	<RiMenuFill size="2.5em" color={color} />
);

const NavBar: React.FC = (props): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);

	return (
		<NavBarContainer {...props}>
			<Logo w="100px" />
			<MenuToggle toggle={toggle} isOpen={isOpen} />
			<MenuLinks isOpen={isOpen} />
		</NavBarContainer>
	);
};

const MenuToggle = ({
	toggle,
	isOpen,
}: {
  toggle: VoidFunction
  isOpen: boolean
}): JSX.Element => {
	const fgColor = useColorModeValue('black', 'white');
	return (
		<Box display={{ base: 'block', md: 'none' }} onClick={toggle}>
			{isOpen ? <CloseIcon color={fgColor} /> : <MenuIcon color={fgColor} />}
		</Box>
	);
};

const MenuItem = ({
	children,
	newTab,
	...rest
}: {
  children?: React.ReactNode
  isLast?: boolean
  newTab?: boolean
}): JSX.Element => (
	<AccessibleLink href='' isExternal={newTab}>
		<Text display="block" {...rest}>
			{children}
		</Text>
	</AccessibleLink>
);

const MenuLinks = ({ isOpen }: { isOpen: boolean }): JSX.Element => {
	const [session, loading] = useSession();

	
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
				{/* <MenuItem to="/">Bounty Board</MenuItem>*/}
				{/* TODO: enabled this with web3 integration */}
				{/* <MenuItem to="#">*/}
				{/*  <ColorModeButton>Connect Wallet</ColorModeButton>{' '}*/}
				{/* </MenuItem>*/}
				<MenuItem newTab={false}>
					{/* <Button onClick={DiscordOAuth(router.query.code)} id='DiscordButton'>Join DAO</Button>{' '}*/}
					{ loading ? <span>Loading...</span> : <Button onClick={() => session ? signOut() : signIn('discord')} id='DiscordButton'>{session ? session.user?.name : 'Join DAO'}</Button>}
				</MenuItem>
				<ThemeToggle />
			</Stack>
		</Box>);
};

const NavBarContainer: React.FC = (props): JSX.Element => (
	<Flex
		as="nav"
		align="center"
		justify="space-between"
		wrap="wrap"
		w="100%"
		p={8}
		{...props}
	>
		{props.children}
	</Flex>
);

export default NavBar;
