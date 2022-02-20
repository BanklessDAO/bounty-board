import React, { useContext } from 'react';
import { Flex } from '@chakra-ui/react';
import Logo from './Logo';
import { Menu } from './Menu';
import { CustomerContext } from '../../../context/CustomerContext';

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

const NavBar: React.FC = (props): JSX.Element => {
	const { customer } = useContext(CustomerContext);
	return (
		<NavBarContainer {...props}>
			<Logo
				alt={`${customer?.customerName ?? 'DAO'} Logo`}
				img={customer?.customization?.logo ?? './logo.png'}
			/>
			<Menu />
		</NavBarContainer>
	);
};

export default NavBar;
