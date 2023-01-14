import RestrictedTo from '@app/components/global/Auth';
import PAID_STATUS from '@app/constants/paidStatus';
import { BountyCollection } from '@app/models/Bounty';
import ServiceUtils from '@app/utils/ServiceUtils';
import { Button, Box, useColorMode, useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';
import MarkPaidModal from '../Form/MarkPaidModal';

const useShowMarkPaid = (bounty: BountyCollection): boolean => {
	const show = useMemo(() => {
		return ServiceUtils.canChangePaidStatus(bounty, bounty.paidStatus == PAID_STATUS.PAID ? PAID_STATUS.UNPAID : PAID_STATUS.PAID);
	}, [bounty]);
	console.log(`show ${show}`);
	return show;
};

export const BountyMarkPaidButton: React.FC<{ bounty: BountyCollection, onCloseParent: () => void }> = ({
	bounty,
	onCloseParent,
}) => {
	const { colorMode } = useColorMode();
	const {
		isOpen: isMarkPaidOpen,
		onOpen: onMarkPaidOpen,
		onClose: onMarkPaidClose,
	} = useDisclosure();
	const closeModal = () => {
		onMarkPaidClose();
		onCloseParent();
	};

	const proposedStatus = bounty.paidStatus == PAID_STATUS.PAID ? PAID_STATUS.UNPAID : PAID_STATUS.PAID;
	const show = useShowMarkPaid(bounty);
	return (
		<>
			{show && (
				<RestrictedTo roles={['edit-own-bounty', 'admin']}>
					<Box p={2}>
						<Button
							boxShadow={'md'}
							transition="background 100ms linear"
							aria-label="mark-paid-button"
							bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
							size='md'
							width='200px'
							onClick={onMarkPaidOpen}>
							Mark {proposedStatus}
						</Button>
					</Box>
					<MarkPaidModal
						isOpen={isMarkPaidOpen}
						onClose={closeModal}
						bounties={[bounty]}
						markPaidMessage={`Mark this bounty as ${proposedStatus}?`}
						markPaidOrUnpaid={proposedStatus}
					/>

				</RestrictedTo>
			)}
		</>
	);
};
