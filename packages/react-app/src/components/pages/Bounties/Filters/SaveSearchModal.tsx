import { useDynamicUrl } from '@app/hooks/useUrlFilters';
import { useUser } from '@app/hooks/useUser';
import { FilterParams } from '@app/types/Filter';
import axios from '@app/utils/AxiosUtils';
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { mutate } from 'swr';

const SaveSearchModal = ({
	onClose,
	isOpen,
	filters,
	discordId,
}: {
  onClose: any;
  isOpen: boolean;
  filters: FilterParams;
  discordId: string;
}): JSX.Element => {
	const [name, setName] = useState('');
	const { user } = useUser();
	const savedQuery = useDynamicUrl(filters, true);
	const toast = useToast();

	const onSave = () => {
		axios
			.post(`/api/savedQuery?customerId=${filters.customerId}`, {
				customerId: filters.customerId,
				discordId,
				savedQuery,
				name,
			})
			.then(() => {
				user && mutate(`/api/savedQuery?discordId=${user.id}`);
				toast({
					title: 'Saved Query .',
					description: 'Query has been saved successfully',
					status: 'success',
					duration: 5000,
					isClosable: true,
				});
				onClose();
			})
			.catch((e) => {
				toast({
					title: 'Failed to save query.',
					description: e.message,
					status: 'error',
					duration: 5000,
					isClosable: true,
				});
			});
	};

	return (
		<Modal onClose={onClose} isOpen={isOpen} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Save this Search</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Input
						placeholder="Enter the name for this search?"
						onChange={(e) => setName(e.target.value)}
					/>
				</ModalBody>
				<ModalFooter>
					<Button onClick={onSave} disabled={!name}>
                      Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default SaveSearchModal;
