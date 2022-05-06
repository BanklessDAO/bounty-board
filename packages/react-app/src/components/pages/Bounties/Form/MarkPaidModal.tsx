import { Button, Alert, AlertIcon } from '@chakra-ui/react';
import React, { useState } from 'react';
import axios from '@app/utils/AxiosUtils';
import { BountyCollection } from '@app/models/Bounty';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from '@chakra-ui/react';
import PAID_STATUS from '@app/constants/paidStatus';

type SetState<T extends any> = (arg: T) => void;

const asyncSome = async (arr: Array<any>, predicate: (arg0: any) => any) => {
	for (const e of arr) {
		if (await predicate(e)) return true;
	}
	return false;
};

const MarkPaidModal = ({ isOpen, onClose, bounties, setMarkedSomePaid } :
	{ isOpen: boolean, onClose: () => void, bounties: BountyCollection[] | undefined, setMarkedSomePaid : SetState<boolean>,
}) => {

	const [error, setError] = useState(false);

	const handleMarkPaid = async () => {
		await markBountiesPaid();
		onClose();
	};

	const markBountiesPaid = async () => {
		console.log(bounties);
		let markedSome = false;
		bounties && await asyncSome(bounties, async (bounty: BountyCollection) => {
			bounty.paidStatus = PAID_STATUS.PAID;
			console.log(bounty);
			try {
				const res = await axios.patch<void, any, BountyCollection>(
					`api/bounties/${bounty._id}?customerId=${bounty.customerId}&force=true`, bounty
				);
				if (res.status !== 200)	{
					setError(true);
					console.log(`res.status: ${res.status}`);
					return true;
				}
				markedSome = true;
			} catch (e) {
				console.error(e);
				setError(true);
				return true;
			}
			return false;
		});
		if (markedSome) setMarkedSomePaid(true);
	};


	return (
		<Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered >
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Mark Paid?</ModalHeader>
				{
					error &&
				<Alert status='error'>
					<AlertIcon />
					There was a problem marking the bounties as paid
				</Alert>
				}
				<ModalCloseButton />
				<ModalBody>
				Export completed. Mark exported bounties as paid?
				</ModalBody>

				<ModalFooter>
					<Button colorScheme='blue' mr={3} onClick={handleMarkPaid}>
					Yes
					</Button>
					<Button variant='ghost' onClick={onClose}>
					No
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default MarkPaidModal;

