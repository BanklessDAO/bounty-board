import ErrorAlert from '@app/components/parts/ErrorAlert';
import ACTIVITY from '@app/constants/activity';
import BOUNTY_STATUS from '@app/constants/bountyStatus';
import { BountyCollection } from '@app/models/Bounty';
import axios from '@app/utils/AxiosUtils';
import { newActivityHistory, newStatusHistory } from '@app/utils/formUtils';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useColorMode, useDisclosure } from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import router from 'next/router';
import { useCallback, useState } from 'react';
import { mutate } from 'swr';


const deleteBounty = async (bounty: BountyCollection): Promise<AxiosResponse<{ data: BountyCollection }>> => {
	const deleteData: Partial<BountyCollection> = {
		activityHistory: newActivityHistory(bounty.activityHistory as [], ACTIVITY.DELETE),
		statusHistory: newStatusHistory(bounty.statusHistory as [], BOUNTY_STATUS.DELETED),
		status: BOUNTY_STATUS.DELETED,
	};
	return await axios.patch<{ data: BountyCollection }>(
		`api/bounties/${bounty._id}?customerId=${bounty.customerId}`,
		deleteData,
		{ baseURL: '/' });

};

const DeleteBountyConfirm = ({ bounty, disclosure }: {
    bounty: BountyCollection,
    disclosure: ReturnType<typeof useDisclosure>
}): JSX.Element => {
	const [deleting, setDeleting] = useState(false);
	const { colorMode } = useColorMode();
	const [error, setError] = useState('');
	const { onClose, isOpen } = disclosure;

	const onClick = useCallback(() => {
		setDeleting(true);
		deleteBounty(bounty).then(({ data: res }) => {
			mutate(`/api/bounties/${bounty._id}`, res.data);
			router.push(`/${bounty._id}`);
			localStorage.removeItem('cachedEdit');
		})
			.catch(err => {
				console.error(err);
				setError('There was a problem deleting the bounty');
			})
			.finally(() => {
				setDeleting(false);
				onClose();
			});
	}, [setError, mutate, deleteBounty, bounty, router, setDeleting]);

	return (
		<Modal onClose={onClose} isOpen={isOpen} isCentered>
		  		<ModalOverlay />
		  		<ModalContent>
				<ModalHeader>Are you Sure?</ModalHeader>
				<ErrorAlert error={error} setError={setError} />
				<ModalCloseButton />
				<ModalBody
					flexDirection="column"
					justifyContent="space-evenly"
				>
					<Text>Please confirm you want to delete this bounty. This action cannot be undone</Text>
				</ModalBody>
				<ModalFooter justifyContent="start">
					<Button transition="background 100ms linear"
						onClick={onClick}
						isLoading={deleting}
						loadingText='Deleting'
						bg={colorMode === 'light' ? 'red.300' : 'red.700'}
					>
						Confirm
					</Button>
			  		<Button ml="3" onClick={onClose}>Close</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default DeleteBountyConfirm;