import React, { useEffect, useState } from 'react';
import { Button, Box, Flex, Text, Stack, useColorModeValue, useColorMode } from '@chakra-ui/react';

import { RiMenuFill, RiCloseFill } from 'react-icons/ri';

import Logo from './Logo';
import ThemeToggle from '../../parts/ThemeToggle';
import AccessibleLink from '../../parts/AccessibleLink';
import { DAOSelector } from './DAOSelector';
import { Customer } from '../../../types/Customer';
import { customers } from '../../../models/stubs/Customer';

const CloseIcon = ({ color }: { color: string }) => (
	<RiCloseFill size="2.7em" color={color} />
);
const MenuIcon = ({ color }: { color: string }) => (
	<RiMenuFill size="2.5em" color={color} />
);

const NavBar = ({ customer, setCustomer, props }: {
	customer: Customer,
	setCustomer(): any,
	props: any
}): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);

	return (
		<NavBarContainer {...props}>
			{ !isOpen ?
				<Logo alt={`${customer.name} Logo`} img={customer.customization?.logo ?? './logo.png'}/>
				: null
			}
			<MenuToggle toggle={toggle} isOpen={isOpen} />
			<MenuLinks
				isOpen={isOpen}
				customers={customers}
				customer={customer}
				setCustomer={setCustomer}				
			/>
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
	to = '/',
	newTab,
	...rest
}: {
  children?: React.ReactNode
  isLast?: boolean
  to: string
  newTab?: boolean
}): JSX.Element => (
	<AccessibleLink href={to} isExternal={newTab}>
		<Text display="block" {...rest}>
			{children}
		</Text>
	</AccessibleLink>
);

const MenuLinks = ({
	isOpen,
	customer,
	setCustomer,
	customers
}: { isOpen: boolean; customer: Customer; setCustomer(): any; customers: Customer[]; }): JSX.Element => {

	const [discordUser, setDiscordUser] = useState<Object | any | null>(null)
	const [authorizationCode, setAuthorizationCode] = useState<string | null>(null)
	const [accessToken, setAccessToken] = useState<string | null>(null)
	const [tokenType, setTokenType] = useState<string | null>(null)
	const { colorMode } = useColorMode();

	const oauthResult = async (authorizationCode: string): Promise<any> => {
		let response = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams({
			client_id: `892232488812965898`,
			client_secret: `IB33yqHzgiG4VhFxr6cB0Tr5oEAnihmq`,
			code: authorizationCode,
			grant_type: 'authorization_code',
			redirect_uri: `http://localhost:3000/`,
			scope: 'identify',
		}),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});

	return await response.json();
	
} 
	const getDiscordUser = async (tokenType: string | null, accessToken: string | null): Promise<any> => {
		let response = await fetch('https://discord.com/api/users/@me', {
				headers:  {
					authorization: `${tokenType} ${accessToken}`,
				},
			})

		let user = await response.json()
		setDiscordUser(user)
	}

	
	useEffect(() => {
		const fragment = new URLSearchParams(window.location.search.slice(1));
		const retrievedCode = fragment.get('code');
		setAuthorizationCode(retrievedCode)

		if (retrievedCode) {
			try {
				const result = oauthResult(retrievedCode)
				.then(res => {
					setAccessToken(res.access_token)
					setTokenType(res.token_type)
					getDiscordUser(res.token_type, res.access_token)
				})
				
		} catch (error) {
				// NOTE: An unauthorized token will not throw an error;
				// it will return a 401 Unauthorized response in the try block above
				console.log(error)
			}
		}
	}, []);

	
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
			<DAOSelector
				customers={customers}
				customer={customer}
				setCustomer={setCustomer}
			/>
			<MenuItem to="https://discord.com/api/oauth2/authorize?client_id=892232488812965898&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code&scope=identify%20guilds%20guilds.join" newTab={false}>
				{/*<Button onClick={DiscordOAuth(router.query.code)} id='DiscordButton'>Join DAO</Button>{' '}*/}
				<Button
					id='DiscordButton'
					bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
				>
					{(discordUser) ? discordUser.username : 'Join DAO'}
				</Button>{' '}
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
