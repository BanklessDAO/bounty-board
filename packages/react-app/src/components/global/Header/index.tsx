import React, { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import Logo from './Logo';
import { CustomerProps } from '../../../types/Customer';
import { MenuLinks, MenuToggle } from './Menu';

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

const NavBar = ({ customer, setCustomer, props }: {
	customer: CustomerProps,
	setCustomer(): any,
	props: any
}): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);

	return (
		<NavBarContainer {...props}>
			{ !isOpen ?
				<Logo
					alt={`${customer.CustomerName} Logo`}
					img={customer.Customization?.Logo ?? './logo.png'}/>
				: null
			}
			<MenuToggle toggle={toggle} isOpen={isOpen} />
			<MenuLinks
				isOpen={isOpen}
				customer={customer}
				setCustomer={setCustomer}
			/>
		</NavBarContainer>
	);
};


export default NavBar;
