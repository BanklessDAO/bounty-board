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
	const handleMarkPaid = async () => {
		await markBountiesPaid();
		// onClose();
	};

	const markBountiesPaid = async () => {
		setDoneMarking(false);
		if (bounties && user) {
			const markBounties = bounties?.map(async function(bounty) {
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
						// TODO: Catch errors here, put a message on the bounty summary about what happened if possible
						// TODO: "doneMarking" not getting reset on modal close
						// TODO: Currency shows a strange value for a while before it switches
						// TODO: Bounty List doesn't refresh after making right away
						setError(true);
						bounty.paidStatus = 'Error Marking';
						return true;
					}
					bounty.paidStatus = PAID_STATUS.PAID;
				} catch (e) {
					console.error(e);
					bounty.paidStatus = 'Error Marking';
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
		<>
			{isOpen && (<Modal
				closeOnOverlayClick={false}
				isOpen={isOpen}
				onClose={onClose}
				isCentered
				size={'3xl'}
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
					<ModalBody>Export completed. {doneMarking ? 'Marking complete.' : markPaidMessage}
						<Divider mt={2} mb={2} />
						<Box overflowY="auto" maxHeight="400px" width={{ base: '95vw', lg: '700px' }}>
							{bounties?.map((bounty) =>
								<Box key={bounty._id} w="100%" borderWidth={3} borderRadius={10} mb={1}>
									<Box key={bounty._id} w="100%" pb={2} pt={0} >
										<BountySummary bounty={bounty} paidStatus={undefined} />
									</Box>
								</Box>

							)}

						</Box>
						<Divider mt={2} mb={2} />
					</ModalBody>

					<ModalFooter>
						{doneMarking ?
							<Button variant="ghost" onClick={onClose}>
									Close
							</Button>
							:
							<><Button colorScheme="blue" mr={3} onClick={handleMarkPaid}>
									Yes
							</Button>
							<Button variant="ghost" onClick={onClose}>
									No
							</Button></>
						}
					</ModalFooter>
				</ModalContent>
			</Modal>) }
		</>
	);
};

export default MarkPaidModal;
