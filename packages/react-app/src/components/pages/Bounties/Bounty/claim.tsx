import { useUser } from '@app/hooks/useUser';
import { BountyClaimCollection, BountyCollection, StatusHistoryItem } from '@app/models/Bounty';
import axios from '@app/utils/AxiosUtils';
import { Alert, AlertIcon, Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, Tooltip, useColorMode, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useContext } from 'react';
import { claimedBy, newStatusHistory } from '@app/utils/formUtils';
import AccessibleLink from '@app/components/parts/AccessibleLink';
import { CustomerContext } from '@app/context/CustomerContext';
import { baseUrl } from '@app/constants/discordInfo';
import { useRequiredRoles } from '@app/components/global/Auth';
import { mutate } from 'swr';

const BountyClaim = ({ bounty }: { bounty: BountyCollection }): JSX.Element => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const router = useRouter();
	const { colorMode } = useColorMode();
	const { user } = useUser();
	const [message, setMessage] = useState<string>();
	const [claiming, setClaiming] = useState(false);
	const [error, setError] = useState(false);

	const confirmBounty = async () => {

		if (message && user) {
			const claimData: BountyClaimCollection = {
				claimedBy: claimedBy(user),
				submissionNotes: message,
				status: 'In-Progress',
				statusHistory: newStatusHistory(bounty.statusHistory as StatusHistoryItem[]),
			};
			try {
				setClaiming(true);
				const res = await axios.patch<void, any, BountyClaimCollection>(
					`api/bounties/${bounty._id}/claim?customerId=${bounty.customerId}`, claimData
				);
				if (res.status === 200)	{
					const bountyPageRoute = '/' + bounty._id;
					const updatedBounty = { ...bounty, ...claimData };
					mutate(`/api/bounties${bountyPageRoute}`, updatedBounty, false);
					if (router.route !== bountyPageRoute) router.push(bountyPageRoute);
				}
			} catch {
				setError(true);
			} finally {
				setClaiming(false);
			}
		} else {
			setError(true);
		}
	};
	
	return (
		<>
	  		{
				bounty.discordMessageId
				// If we have discord message info for the bounty, the user is taken into discord to claim
					? <ClaimDiscord discordMessageId={bounty.discordMessageId} />
				// else, they must use the web form variant
			 	: <ClaimWeb onOpen={onOpen} />
			}
			<Modal onClose={onClose} isOpen={isOpen} isCentered>
		  		<ModalOverlay />
		  		<ModalContent>
					<ModalHeader>Claim This Bounty</ModalHeader>
					{
						claiming &&
							<Alert status='success'>
    							<AlertIcon />
								Bounty Claimed!
  							</Alert>
					}
					{
						error &&
						<Alert status='error'>
							<AlertIcon />
							There was a problem claiming the bounty
					  	</Alert>
					}
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
							disabled={!message || bounty.status !== 'Open'}
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

export const ClaimDiscord = ({ discordMessageId }: { discordMessageId: string }): JSX.Element => {
	const { customer: { customerId, bountyChannel } } = useContext(CustomerContext);
	const url = `${baseUrl}/${customerId}/${bountyChannel}/${discordMessageId}`;
	const { colorMode } = useColorMode();
	return (
		<AccessibleLink href={url}>
			<Button
				transition="background 100ms linear"
				bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
				my={2} size="sm"
			>
				Claim It
			</Button>
		</AccessibleLink>
	);

};

export const ClaimWeb = ({ onOpen }: { onOpen: () => void }): JSX.Element => {
	const { colorMode } = useColorMode();
	const canClaim = useRequiredRoles(['claim-bounties', 'admin']);
	const notSignedInHelpMessage = canClaim ? 'Claim this bounty	' : 'You need to sign in and have the correct permissions to claim this bounty';
	return (
		<Tooltip
			hasArrow
			label={notSignedInHelpMessage}
			shouldWrapChildren
			mt='3'
			display={canClaim ? 'hidden' : 'inline-block'}
		>
			<Button
				transition="background 100ms linear"
				aria-label='claim-button'
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
	);
};

export default BountyClaim;