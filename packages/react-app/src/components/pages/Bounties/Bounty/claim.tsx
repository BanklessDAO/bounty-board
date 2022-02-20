import { useUser } from '@app/hooks/useUser';
import { BountyClaimCollection, BountyCollection, StatusHistoryItem } from '@app/models/Bounty';
import axios from '@app/utils/AxiosUtils';
import { Alert, AlertIcon, Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, Tooltip, useColorMode, useDisclosure } from '@chakra-ui/react';
import { APIUser } from 'discord-api-types';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AuthContext } from '@app/context/AuthContext';
import { useContext } from 'react';


const claimedBy = (user: APIUser) => (
	{
		discordHandle: user?.username,
		discordId: user?.id,
	}
);

const newStatusHistory = (oldStatusHistory: StatusHistoryItem[]): StatusHistoryItem[] => {
	const newStatus: StatusHistoryItem = {
		modifiedAt: new Date().toISOString(),
		status: 'In-Progress',
	};
	return [...oldStatusHistory, newStatus];
};

const BountyClaim = ({ bounty }: { bounty: BountyCollection }): JSX.Element => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const router = useRouter();
	const { colorMode } = useColorMode();
	const { user } = useUser();
	const [message, setMessage] = useState<string>();
	const [claiming, setClaiming] = useState(false);
	const [claimed, setClaimed] = useState(false);

	const notSignedInHelpMessage = 'Ensure you are signed in with Discord and have permissions in order to claim bounties';

	const { roles: userRoles } = useContext(AuthContext);
	const canClaim: boolean = userRoles.includes('claim-bounties');

	const confirmBounty = async () => {
		if (message && user) {
			try {
				setClaiming(true);
				const res = await axios.patch<void, any, BountyClaimCollection>(
					`api/bounties/${bounty._id}/claim?customerId=${bounty.customerId}`
					, {
						claimedBy: claimedBy(user),
						submissionNotes: message,
						status: 'In-Progress',
						statusHistory: newStatusHistory(bounty.statusHistory as StatusHistoryItem[]),
					}
				);
				if (res.status === 200)	{
					setClaimed(true);
					await new Promise(resolve => setTimeout(resolve, 2000)).then(() => {
						router.push('/' + bounty._id);
						setClaimed(false);
					});
				}
			} finally {
				setClaiming(false);
			}
		} else {
			throw new Error('Missing Message');
		}
	};
	return (
	  <>
			<Tooltip hasArrow label={notSignedInHelpMessage} shouldWrapChildren mt='3' display={canClaim ? 'hidden' : 'inline-block'}>
				<Button transition="background 100ms linear"
					bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
					onClick={onOpen}
					disabled={!canClaim}
				>
            Claim It
				</Button>
				<Text
					as="i"
					my={1}
					color="primary.500"
					display={canClaim ? 'none' : { base: 'block', md: 'none' }}
				>
					{notSignedInHelpMessage}
				</Text>
			</Tooltip>
			<Modal onClose={onClose} isOpen={isOpen} isCentered>
		  <ModalOverlay />
		  <ModalContent>
					<ModalHeader>Claim This Bounty</ModalHeader>
					{claimed && <Alert status='success'>
    			<AlertIcon />
    			Bounty Claimed!
  			</Alert>}
					<ModalCloseButton />
					<ModalBody
						flexDirection="column"
						justifyContent="space-evenly"
					>
						<Flex mb="5">
					Add a message to the bounty creator, then hit 'confirm' to send and claim the bounty.
						</Flex>
						<Textarea placeholder='Send a message' onChange={e => setMessage(e.target.value)} />
					</ModalBody>
					<ModalFooter justifyContent="start">
						<Button transition="background 100ms linear"
							disabled={claimed || !message}
							onClick={confirmBounty}
							isLoading={claiming}
							loadingText='Submitting'
							bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
						>
					Claim It
						</Button>
			  	<Button ml="3" onClick={onClose}>Close</Button>
					</ModalFooter>
		  </ModalContent>
			</Modal>
	  </>
	);
};

export default BountyClaim;