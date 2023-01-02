import { Button, Alert, AlertIcon, Box, Divider } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
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
import PAID_STATUS, { PAID_STATUS_VALUES } from '@app/constants/paidStatus';
import { actionBy, newActivityHistory } from '@app/utils/formUtils';
import ACTIVITY from '@app/constants/activity';
import { useUser } from '@app/hooks/useUser';
import { BountySummary } from '../Bounty';
import { BountiesUpdatedContext } from '..';
import { useEffect } from 'react';

const MarkPaidModal = ({
	isOpen,
	onClose,
	bounties,
	markPaidMessage,
	markPaidOrUnpaid = PAID_STATUS.PAID,
}: {
	isOpen: boolean;
	onClose: () => void;
	bounties: BountyCollection[] | undefined;
	markPaidMessage: string;
	markPaidOrUnpaid: PAID_STATUS_VALUES
}) => {

	interface ErrorMessages {
		[id : string] : string;
	}

	
	const [error, setError] = useState(false);
	const [errorMsgs, setErrorMsgs] = useState({} as ErrorMessages);
	const { user } = useUser();
	const [doneMarking, setDoneMarking] = useState(false);
	const { setBountiesUpdated } = useContext(BountiesUpdatedContext);
	const [ bountiesDisplayed, setBountiesDisplayed ] = useState<BountyCollection[]>([]);
	console.log(`In Modal: bounties: ${bounties?.length} bountiesDisplayed ${bountiesDisplayed.length} isOpen ${isOpen}`);

	// Only set our copy once when modal is open, then leave it
	useEffect(() => {
		if (bounties && isOpen && !bountiesDisplayed.length) {
			setBountiesDisplayed(bounties);
		}
	}, [bounties, isOpen]);

	const handleMarkPaid = async () => {
		await markBountiesPaid();
	};
	const modalClose = () => {
		console.log('Modal Closed');
		setDoneMarking(false);
		setError(false);
		setErrorMsgs({});
		setBountiesDisplayed([]);
		onClose();
	};

	const markBountiesPaid = async () => {
		setDoneMarking(false);
		if (bountiesDisplayed && user) {
			const successes = bountiesDisplayed?.map(async function(bounty) {

				const paidData: BountyPaidCollection = {
					paidBy: markPaidOrUnpaid == PAID_STATUS.PAID ? actionBy(user) : { discordId: undefined, discordHandle: undefined, iconUrl: null },
					paidStatus: markPaidOrUnpaid,
					paidAt: markPaidOrUnpaid == PAID_STATUS.PAID ? new Date().toISOString() : '',
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
						setErrorMsgs(eMsgs => {
							eMsgs[bounty._id] = `${res.message}`;
							return eMsgs;
						});
						return false;
					}
					bounty.paidStatus = markPaidOrUnpaid;
				} catch (e: any) {
					console.log(`Errors before ${JSON.stringify(errorMsgs)}`);
					setErrorMsgs(eMsgs => {
						eMsgs[bounty._id] = `${e.response?.data?.message || 'Server error'}`;
						return eMsgs;
					});
					console.log(`Errors after ${JSON.stringify(errorMsgs)}`);
					setError(true);
					return false;
				}
				return true;

			});
			Promise.all(successes).then((anySuccess) => {
				setDoneMarking(true);
				console.log(`Any success: ${JSON.stringify(anySuccess)}`);
				if (anySuccess.includes(true)) {
					setBountiesUpdated(true);
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
				<ModalHeader>Mark Bounty</ModalHeader>
				{error && (
					<Alert status="error">
						<AlertIcon />
						{bountiesDisplayed && bountiesDisplayed.length == 1 ?
							`There was a problem marking the bounty ${markPaidOrUnpaid}` :
							`There was a problem marking some bounties ${markPaidOrUnpaid}`
						}
					</Alert>
				)}
				<ModalCloseButton />
				<ModalBody> {doneMarking ? 'Marking complete.' : markPaidMessage}
					<Divider mt={2} mb={2} />
					<Box overflowY="auto" maxHeight="400px" width={{ base: '95vw', lg: '700px' }}>
						{bountiesDisplayed?.map((bounty) =>
							<Box key={bounty._id} w="100%" borderWidth={3} borderRadius={10} mb={1}>
								<Box key={bounty._id} w="100%" pb={2} pt={0} >
									<BountySummary bounty={bounty} errorMsg={errorMsgs[bounty._id]} />
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
