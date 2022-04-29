import {
	Avatar,
	Button,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useDisclosure } from '@chakra-ui/react';
import { toggleDiscordSignIn } from '@app/services/discord.service';
import React from 'react';

const UserMenu = () => {
	const { data: session } = useSession({ required: false });
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<Menu>
			<MenuButton as={'button'}>
				<Avatar src={session?.user?.image ?? ''} mr={'.25em'} size={'md'} />
			</MenuButton>
			<MenuList>
				<MenuItem onClick={() => onOpen()}>Add Wallet Address</MenuItem>
				<MenuItem onClick={() => toggleDiscordSignIn(session)}>Logout</MenuItem>
			</MenuList>
			{/* Add Wallet Address Modal */}
			<Modal isOpen={isOpen} onClose={() => onClose()} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign={'center'}>Enter Wallet Address</ModalHeader>
					<ModalBody>
						<Input />
						<Button my={'1em'} w={'100%'}>
              Save Address
						</Button>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Menu>
	);
};

export default UserMenu;
