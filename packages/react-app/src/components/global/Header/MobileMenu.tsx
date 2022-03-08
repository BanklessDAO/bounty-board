import React, { useContext } from 'react';
import Logo from './Logo';
import {
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Heading,
	Divider,
	Flex,
} from '@chakra-ui/react';
import { CustomerContext } from '../../../context/CustomerContext';
import ThemeToggle from '@app/components/parts/ThemeToggle';
import { MenuLinks } from './MenuLinks';

interface MobileProps {
  isOpen: boolean;
  onClose: VoidFunction;
}

export const MobileMenu = ({ isOpen, onClose }: MobileProps): JSX.Element => {
	const { customer } = useContext(CustomerContext);
	return (
		<Drawer isOpen={isOpen} onClose={onClose} placement="right" size="xs">
			<DrawerOverlay />
			<DrawerContent>
				<DrawerHeader display={'flex'} flexDirection="column" p="2">
					<Flex>
						<Logo
							alt={`${customer?.customerName ?? 'DAO'} Logo`}
							img={customer?.customization?.logo ?? '/logo.png'}
						/>
						<DrawerCloseButton w={'4em'} h={'4em'} onClick={onClose} />
					</Flex>
					<Flex alignItems={'center'} justifyContent="center">
						<Heading as="h1" size="xl" mb={'.25em'}>
							<u>Bounty Board</u>
						</Heading>
					</Flex>
				</DrawerHeader>
				<Divider display={{ md: 'none' }} variant={'solid'} />
				<DrawerBody mt="1" p="0" display={'flex'} flexDirection={'column'}>
					<MenuLinks />
				</DrawerBody>
				<DrawerFooter>
					<ThemeToggle />
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};
