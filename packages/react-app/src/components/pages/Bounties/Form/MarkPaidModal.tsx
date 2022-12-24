import { Button, Alert, AlertIcon, Box, Divider } from '@chakra-ui/react';
import React, { useState } from 'react';
import axios from '@app/utils/AxiosUtils';
import { ActivityHistoryItem, BountyCollection, BountyPaidCollection } from '@app/models/Bounty';
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
import { actionBy, newActivityHistory } from '@app/utils/formUtils';
import ACTIVITY from '@app/constants/activity';
import { useUser } from '@app/hooks/useUser';
import { BountySummary } from '../Bounty';

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
	const { user } = useUser();
	const [doneMarking, setDoneMarking] = useState(false);
	const [bountiesToMark, setBountiesToMark] = useState([] as BountyCollection[]);
	if (isOpen && !bountiesToMark.length && bounties?.length) setBountiesToMark(bounties);
	const handleMarkPaid = async () => {
		await markBountiesPaid();
		// onClose();
	};
	const modalClose = () => {
		setDoneMarking(false);
		setBountiesToMark([]);
		onClose();
	};

	const markBountiesPaid = async () => {
		setDoneMarking(false);
		if (bountiesToMark && user) {
			const markBounties = bountiesToMark?.map(async function(bounty) {
				const paidData: BountyPaidCollection = {
					paidBy: actionBy(user),
					paidStatus: PAID_STATUS.PAID,
					paidAt: new Date().toISOString(),
					activityHistory: newActivityHistory(
						bounty.activityHistory as ActivityHistoryItem[],
						ACTIVITY.PAID
					),
				};
				try {
					const res = await axios.patch<void, any, BountyPaidCollection>(
						`api/bounties/${bounty._id}/paid?customerId=${bounty.customerId}`,
						paidData
					);
					if (res.status !== 200) {
						// Not sure this code ever gets hit. Errors will go to catch
						// TODO: Bounty List doesn't refresh after making right away
						setError(true);
						bounty.paidStatus = `Error|${res.message}`;
						return true;
					}
					bounty.paidStatus = PAID_STATUS.PAID;
				} catch (e: any) {
					bounty.paidStatus = `Error|${e.response?.data?.message || 'Server error'}`;
					setError(true);
					return true;
				}
				return false;

			});
			Promise.all(markBounties).then((anyErrors) => {
				setDoneMarking(true);
				if (anyErrors.includes(false)) {
					setMarkedSomePaid(true);
				}
		 	});
		}
	};

	return (
		<Modal
			closeOnOverlayClick={false}
			isOpen={isOpen}
			onClose={modalClose}
			isCentered
			size={'3xl'}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Mark Paid?</ModalHeader>
				{error && (
					<Alert status="error">
						<AlertIcon />
						There was a problem marking some bounties as paid
					</Alert>
				)}
				<ModalCloseButton />
				<ModalBody>Export completed. {doneMarking ? 'Marking complete.' : markPaidMessage}
					<Divider mt={2} mb={2} />
					<Box overflowY="auto" maxHeight="400px" width={{ base: '95vw', lg: '700px' }}>
						{bountiesToMark?.map((bounty) =>
							<Box key={bounty._id} w="100%" borderWidth={3} borderRadius={10} mb={1}>
								<Box key={bounty._id} w="100%" pb={2} pt={0} >
									<BountySummary bounty={bounty} />
								</Box>
							</Box>

						)}

					</Box>
					<Divider mt={2} mb={2} />
				</ModalBody>

				<ModalFooter>
					{doneMarking ?
						<Button variant="ghost" onClick={modalClose}>
									Close
						</Button>
						:
						<><Button colorScheme="blue" mr={3} onClick={handleMarkPaid}>
									Yes
						</Button>
						<Button variant="ghost" onClick={modalClose}>
									No
						</Button></>
					}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default MarkPaidModal;
