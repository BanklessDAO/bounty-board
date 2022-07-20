import { useUser } from '@app/hooks/useUser';
import { SavedQuery } from '@app/types/SavedQuery';
import axios from '@app/utils/AxiosUtils';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from '@chakra-ui/react';
import { mutate } from 'swr';

const DeleteSearchModal = ({ showModal, onClick, queryToDelete }:{ onClick: any, showModal: boolean, queryToDelete: SavedQuery | undefined }):JSX.Element => {
	const { user } = useUser();
	const toast = useToast();

	if (!queryToDelete) return <></>;

	const onDelete = async () => {
		try {
			await axios.delete(`/api/savedQuery?id=${queryToDelete?._id}`);
			user && mutate(`/api/savedQuery?discordId=${user.id}`);
			toast({
				title: 'Deleted Query .',
				description: 'Query has been deleted successfully',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
		} catch (e: any) {
			toast({
				title: 'Delete Query Failed',
				description: e?.message || 'Failed to delete the query',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
		onClick();
	};

	return (
		<Modal onClose={onClick} isOpen={showModal} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Delete this Search</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					Are you sure you want to delete this search?
				</ModalBody>
				<ModalFooter gap={3}>
					<Button colorScheme='primary' onClick={onClick}>Cancel</Button>
					<Button onClick={onDelete}>Delete</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default DeleteSearchModal;