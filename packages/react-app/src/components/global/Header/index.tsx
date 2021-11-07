import React, { useContext, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import Logo from './Logo';
import { MenuLinks, MenuToggle } from './Menu';
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
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);
	const { customer } = useContext(CustomerContext);
	return (
		<NavBarContainer {...props}>
			{ !isOpen ?
				<Logo
					alt={`${customer?.CustomerName ?? 'DAO'} Logo`}
					img={customer?.Customization?.Logo ?? './logo.png'}/>
				: null
			}
			<MenuToggle toggle={toggle} isOpen={isOpen} />
			<MenuLinks isOpen={isOpen} />
		</NavBarContainer>
	);
};


export default NavBar;
