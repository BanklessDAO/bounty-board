import React, { useContext, useState } from 'react';
import {
	Flex,
} from '@chakra-ui/react';
import Logo from './Logo';
import { CustomerContext } from '../../../context/CustomerContext';
import { MenuLinks, MenuToggle } from './Menu';

const NavBarContainer: React.FC = (props): JSX.Element => (
	<Flex
		position="sticky"
		top="0px"
		align="center"
		justify="space-between"
		wrap="wrap"
		w="100%"
		h="16"
		px={5}
		borderBottomWidth={1}
		bg="primary"
		{...props}
	>
		{props.children}
	</Flex>
);

const NavBar: React.FC = (props): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);
	const { customer } = useContext(CustomerContext);
	return (
		<NavBarContainer {...props}>
			{ !isOpen ?
				<Logo
					alt={`${customer?.customerName ?? 'DAO'} Logo`}
					img={customer?.customization?.logo ?? './logo.png'}/>
				: null
			}
			<MenuToggle toggle={toggle} isOpen={isOpen} />
			<MenuLinks isOpen={isOpen} />
		</NavBarContainer>
	);
};


export default NavBar;
