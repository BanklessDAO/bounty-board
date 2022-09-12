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

const MarkPaidModal = ({
	isOpen,
	onClose,
	bounties,
	setMarkedSomePaid,
	markPaidMessage,
}: {
  isOpen: boolean;
  onClose: () => void;
  bounties: BountyCollection[] | undefined;
  setMarkedSomePaid: SetState<boolean>;
  markPaidMessage: string;
}) => {
	const [error, setError] = useState(false);

	const handleMarkPaid = async () => {
		await markBountiesPaid();
		onClose();
	};

	const markBountiesPaid = async () => {
		if (bounties) {
			const markBounties = bounties?.map(async function(bounty) {
				bounty.paidStatus = PAID_STATUS.PAID;
				try {
					const res = await axios.patch<void, any, BountyCollection>(
						`api/bounties/${bounty._id}?customerId=${bounty.customerId}&force=true`,
						bounty
					);
					if (res.status !== 200) {
						setError(true);
						return true;
					}
				} catch (e) {
					console.error(e);
					setError(true);
					return true;
				}
				return false;
	
			});
			Promise.all(markBounties).then((anyErrors) => { !anyErrors.includes(true) && setMarkedSomePaid(true);});
		}
	};

	return (
		<Modal
			closeOnOverlayClick={false}
			isOpen={isOpen}
			onClose={onClose}
			isCentered
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Mark Paid?</ModalHeader>
				{error && (
					<Alert status="error">
						<AlertIcon />
                       There was a problem marking the bounties as paid
					</Alert>
				)}
				<ModalCloseButton />
				<ModalBody>Export completed. {markPaidMessage}</ModalBody>

				<ModalFooter>
					<Button colorScheme="blue" mr={3} onClick={handleMarkPaid}>
                      Yes
					</Button>
					<Button variant="ghost" onClick={onClose}>
                       No
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default MarkPaidModal;
