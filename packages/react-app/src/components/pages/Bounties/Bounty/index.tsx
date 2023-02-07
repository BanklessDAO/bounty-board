import {
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Spacer,
	Box,
	Checkbox,
	Flex,
	Tooltip,
	Tag,
	TagLabel,
	Text,
	HStack,
	Stack,
	Heading,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useColorModeValue,
} from '@chakra-ui/react';
import { useBounty } from '@app/hooks/useBounties';
import { BountyCollection } from '@app/models/Bounty';
import { BountyNotFound } from '@app/pages/[id]';
import { SkeletonCircle, SkeletonText } from '@chakra-ui/skeleton';
import BountyClaim from './claim';
import BountySubmit from './submit';
import { BountyEditButton } from './edit';
import { BountyDeleteButton } from './delete';

import UserAvatar from '@app/components/parts/UserAvatar';
import PAID_STATUS from '@app/constants/paidStatus';
import BOUNTY_STATUS from '@app/constants/bountyStatus';
import MiscUtils from '../../../../utils/miscUtils';
import DOMPurify from 'dompurify';
import { toHTML } from 'discord-markdown';
import ReactHtmlParser from 'react-html-parser';
import { BsThreeDots } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useUser } from '@app/hooks/useUser';

type SetState<T extends any> = (arg: T) => void;

interface StatusProps {
	bounty: BountyCollection;
	withAvatar?: boolean;
}
const Status = ({ bounty, withAvatar }: StatusProps): JSX.Element => (
	<Tag my={0} size="lg" key="lg" variant="outline" colorScheme={bounty.status}>
		{withAvatar && (
			<Box ml={-1} mr={2}>
				<UserAvatar user={bounty.claimedBy} size="xs" />
			</Box>
		)}
		<TagLabel>{bounty.status.replace('-', ' ')}</TagLabel>
	</Tag>
);

const PaidStatus = ({ bounty }: { bounty: BountyCollection }): JSX.Element => (
	<Tag
		my={0}
		size="lg"
		key="lg"
		variant="outline"
		colorScheme={bounty.paidStatus ? bounty.paidStatus : PAID_STATUS.UNPAID}
	>
		<TagLabel>
			{bounty.paidStatus ? bounty.paidStatus : PAID_STATUS.UNPAID}
		</TagLabel>
	</Tag>
);

const BountySelect = ({
	selectedBounties,
	setSelectedBounties,
	bountyId,
}: {
	selectedBounties: string[];
	setSelectedBounties: SetState<string[]>;
	bountyId: string;
}): JSX.Element => {
	const updateSelectedBounties = (event: any): void => {
		const bId = event.target.value;
		if (!selectedBounties.includes(bId)) {
			setSelectedBounties([...selectedBounties, bId]);
		} else {
			setSelectedBounties(
				selectedBounties.filter((selectedBountyId) => {
					return selectedBountyId !== bId;
				})
			);
		}
	};

	return (
		<Checkbox
			size="sm"
			pt="2"
			px="2"
			value={bountyId}
			colorScheme="primary"
			onChange={updateSelectedBounties}
			isChecked={selectedBounties.includes(bountyId)}
		/>
	);
};

const DiscordStub = ({ name }: { name: string | undefined }): JSX.Element => (
	<Flex my={2} align="center" gridGap={3}>
		{name ? (
			<Text fontSize="md" color="steelblue">
				@{name}
			</Text>
		) : (
			'no one'
		)}
	</Flex>
);

const calculateReward = (_reward: BountyCollection['reward']): string => {
	return `${_reward.amount ?? 0} ${_reward.currency}`;
};

const Label = ({ keyword, noMargin = false }: { keyword: string; noMargin?: boolean }): JSX.Element => (
	<Tag
		size="sm"
		colorScheme="teal"
		variant="subtle"
		borderRadius="full"
		ml={noMargin ? 0 : 1.5}
	>
		<TagLabel>
			{keyword.replace('-', ' ')}
		</TagLabel>
	</Tag>
);

const BountyTags = ({
	tags,
	showAll = false,
}: {
	tags: { channelCategory: string, keywords: string[] };
	showAll: boolean;
}): JSX.Element => {
	let labels: string[] = [];

	if (tags.channelCategory) {
		labels = labels.concat(tags.channelCategory);
	} if (tags.keywords) {
		labels = labels.concat(tags.keywords);
	}

	return (
		showAll
			?
			<>
				{labels && labels.map((label, index) => <Label key={index} keyword={label} noMargin={index == 0} />)}
			</>
			:
			<>
				{labels && labels.slice(0, 3).map((label, index) => <Label key={index} keyword={label} noMargin={index == 0} />)}
				{
					labels.length > 3 &&
					<Tooltip
						hasArrow
						label={
							<Stack textAlign="center">
								{labels.slice(3).map((label, index) => <Text key={index}>{label}</Text>)}
							</Stack>
						}
						fontSize="md"
						closeDelay={500}
					>
						<Tag size="sm" colorScheme="teal" variant="subtle" borderRadius="full" ml={1.5}>
							<TagLabel><BsThreeDots /></TagLabel>
						</Tag>
					</Tooltip>

				}
			</>
	);
};

export const BountySummary = ({
	bounty,
}: {
	bounty: BountyCollection;
}): JSX.Element => {
	return (
		<Flex flexWrap="wrap" width="100%" justifyContent="flex-end" pl="2" pr="2">
			<Flex flexWrap="nowrap" width={{ base: '100%', md: '60%' }} mt="2">
				<Box>
					<UserAvatar user={bounty.createdBy} size="sm" />
				</Box>
				<Box pl="2" width="100%">
					<Heading mb={2} size="md" noOfLines={1} flex={{ base: 1, md: 0 }}>
						{bounty.title}
						{bounty.tags &&

							<Text as="span" ml={2} mt={2}>
								<BountyTags tags={bounty.tags} showAll={false} />
							</Text>
						}
					</Heading>
				</Box>
			</Flex>
			<Box
				width={{ base: '100%', md: '30%' }}
				textAlign={{ base: 'left', md: 'right' }}
				mt={{ base: 0, md: 2 }}
				ml="auto"
			>
				{bounty.reward && (
					<Heading mb={4} size="md">
						{calculateReward(bounty.reward)}
					</Heading>
				)}
			</Box>
			<Flex width="100%" justifyContent="space-between" alignItems="center">
				<Box mb={2}>
					for:{' '}
					{bounty.assignTo
						? '@' + bounty.assignTo.discordHandle
						: bounty.assign
							? '@' + bounty.assignedName
							: bounty.gateTo
								? '@' + bounty.gateTo[0].discordName
								: bounty.gate
									? '@' + bounty.gate[0]
									: 'anyone'}
				</Box>
				<Spacer />
				<Box mb={2} pr="2">
					{bounty.status && <Status bounty={bounty} withAvatar={true} />}
				</Box>
				<Box mb={2}>
					<PaidStatus bounty={bounty} />
				</Box>

			</Flex>
		</Flex>
	);
};

export const BountyHeader = ({
	bounty,
}: {
	bounty: BountyCollection;
}): JSX.Element => {
	return (
		<Flex flexWrap="nowrap" width={{ base: '100%', md: '60%' }}>
			<Box pl="2" width="100%">
				<Heading isTruncated mb={2} size="md" flex={{ base: 1, md: 0 }}>
					{bounty.title}
				</Heading>
			</Box>
		</Flex>
	);
};

export const BountyActions = ({
	bounty,
}: {
	bounty: BountyCollection;
	onCancel: () => void;
}): JSX.Element => {
	return (
		<Flex justifyContent={'flex-end'}>
			{bounty.status == BOUNTY_STATUS.DRAFT && <BountySubmit bounty={bounty} />}
			{bounty.status == BOUNTY_STATUS.OPEN && <BountyClaim bounty={bounty} />}
			{(bounty.status == BOUNTY_STATUS.DRAFT ||
				bounty.status == BOUNTY_STATUS.OPEN) && (
				<BountyEditButton bounty={bounty} />
			)}
			{(bounty.status == BOUNTY_STATUS.DRAFT ||
				bounty.status == BOUNTY_STATUS.OPEN) && (
				<BountyDeleteButton bounty={bounty} />
			)}

		</Flex>
	);
};

const BountyModal = ({
	bountyIn,
	isOpen,
	onClose,
}: {
	bountyIn: BountyCollection;
	isOpen: boolean;
	onClose: () => void;
}): JSX.Element => {

	// Keep the bounty data from changing what the modal is displaying if a rerender happens 
	const bounty = useMemo(() => bountyIn, [isOpen]);

	return (
		<Modal scrollBehavior={'inside'} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent maxW={'700px'} borderWidth={3}>
				<ModalHeader
					bg={useColorModeValue('gray.200', 'gray.600')}
					roundedTop="md"
				>
					<BountyHeader bounty={bounty} />
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<BountyDetails bounty={bounty} />
				</ModalBody>
				<ModalFooter>
					<Stack direction='row' spacing={1} alignItems='center' alignContent='center' verticalAlign={'center'}>
						<BountyActions bounty={bounty} onCancel={onClose} />
					</Stack>

				</ModalFooter>
			</ModalContent>
		</Modal>

	);
};

const BountyDetails = ({
	bounty,
}: {
	bounty: BountyCollection;
}): JSX.Element => {
	const { user } = useUser();
	const dueAt = bounty.dueAt
		? MiscUtils.shortDate(new Date(bounty.dueAt))
		: 'unspecified';

	return (
		<Flex justifyItems={'center'} alignItems="center" flexWrap="wrap" width="100%" pl="2" pr="2">
			<Flex flexWrap="wrap" alignItems="center" width="100%" pb="3">
				<Box
					width="120px"
					display="inline-block"
					justifyContent="flex-end"
					alignItems="center"
					pr="2"
				>
					<Heading size="sm" m={0}>
						status
					</Heading>
				</Box>
				<Box pr="2">
					<Status bounty={bounty} />
				</Box>
				<Box pr="2">
					<PaidStatus bounty={bounty} />
				</Box>
				<Spacer />
				<Box>
					{bounty.reward && (
						<Heading size="md" m={0}>
							{calculateReward(bounty.reward)}
						</Heading>
					)}
				</Box>
			</Flex>
			<Flex flexWrap="wrap" alignItems="center" width="80%" pb="3">
				<Box
					width="120px"
					display="inline-block"
					justifyContent="flex-end"
					alignItems="center"
					pr="2"
				>
					<Heading size="sm" m={0}>
						created by
					</Heading>
				</Box>
				<Box pr="2">
					<UserAvatar user={bounty.createdBy} size="xs" />
				</Box>
				<Box width="120px" pr="2">
					<DiscordStub name={bounty.createdBy?.discordHandle} />
				</Box>
				<Spacer />
				<Box
					width="120px"
					display="inline-block"
					justifyContent="flex-end"
					alignItems="center"
					pr="2"
					ml="2"
				>
					<Heading size="sm" m={0}>
						created date
					</Heading>
				</Box>
				<Box>
					<Text as="span" fontSize="sm">
						{MiscUtils.shortDate(new Date(bounty.createdAt))}
					</Text>
				</Box>
			</Flex>
			<Flex flexWrap="wrap" alignItems="center" width="80%" pb="3">
				<Box
					width="120px"
					display="inline-block"
					justifyContent="flex-end"
					alignItems="center"
					pr="2"
				>
					<Heading size="sm" m={0}>
						claimed by
					</Heading>
				</Box>
				<Box pr="2">
					<UserAvatar user={bounty.claimedBy} size="xs" />
				</Box>
				<Box pr="2" width="120px">
					<DiscordStub name={bounty.claimedBy?.discordHandle} />
				</Box>
				<Spacer />
				<Box
					width="120px"
					display="inline-block"
					justifyContent="flex-end"
					alignItems="center"
					pr="2"
					ml="2"
				>
					<Heading size="sm" m={0}>
						due date
					</Heading>
				</Box>
				<Box>
					<Text as="span" fontSize="sm">
						{dueAt}
					</Text>
				</Box>
			</Flex>
			<Flex flexWrap="wrap" alignItems="center" width="100%" pb="3">
				<Box
					width="120px"
					display="inline-block"
					justifyContent="flex-end"
					alignItems="center"
					pr="2"
				>
					<Heading size="sm" m={0}>
						claimable by
					</Heading>
				</Box>
				<Box pr="2">
					<Text isTruncated={true} as="span" fontSize="sm">
						{bounty.assignTo
							? '@' + bounty.assignTo.discordHandle
							: bounty.assign
								? '@' + bounty.assignedName
								: bounty.gateTo
									? '@' + bounty.gateTo[0].discordName
									: bounty.gate
										? '@' + bounty.gate[0]
										: 'anyone'}
					</Text>
				</Box>
			</Flex>
			{bounty.tags &&
				<Flex flexWrap="wrap" alignItems="center" width="100%" pb="3">
					<Box
						width="120px"
						display="inline-block"
						justifyContent="flex-end"
						alignItems="center"
						pr="2"
					>
						<Heading size="sm" m={0}>
							tags
						</Heading>
					</Box>
					<Box pr="2">
						<BountyTags tags={bounty.tags} showAll={true} />
					</Box>
				</Flex>
			}
			<Heading mt="5" width="100%" size="md" mb="0">
				Description
			</Heading>
			<Text mt="2" fontSize="sm" ml="2">
				{ReactHtmlParser(
					DOMPurify.sanitize(toHTML(bounty.description || 'none'))
				)}
			</Text>
			<Heading mt="5" width="100%" size="md" pt="2" mb="0">
				Success Criteria
			</Heading>
			<Text mt="2" fontSize="sm" ml="2">
				{ReactHtmlParser(DOMPurify.sanitize(toHTML(bounty.criteria || 'none')))}
			</Text>
			{bounty.submissionNotes && ([bounty.createdBy.discordId, bounty.claimedBy?.discordId].includes(user?.id)) &&
				<>
					<Heading mt="5" width="100%" size="md" pt="2" mb="0">
						Submission Notes
					</Heading>
					<Text mt="2" fontSize="sm" ml="2">
						{ReactHtmlParser(DOMPurify.sanitize(toHTML(bounty.submissionNotes || 'none')))}
					</Text>
				</>
			}

		</Flex>
	);
};

export const BountyCard = ({
	bounty,
}: {
	bounty: BountyCollection;
}): JSX.Element => {
	const router = useRouter();

	const onCancel = () => {
		router.push('/');
	};
	return (
		<Box width={{ base: '95vw', lg: '700px' }}>
			<Box borderWidth={3} borderRadius={10} mb={3} p={4}>
				<Box pb={5}>
					<BountyHeader bounty={bounty} />
				</Box>
				<Box mx={2}>
					<BountyDetails bounty={bounty} />
				</Box>
				<Box>
					<BountyActions bounty={bounty} onCancel={onCancel} />
				</Box>
			</Box>
		</Box>
	);
};

export const AccordionBountyItem = ({
	bounty,
	selectedBounties,
	setSelectedBounties,
}: {
	bounty: BountyCollection;
	selectedBounties: string[];
	setSelectedBounties: SetState<string[]>;
}): JSX.Element => (
	<AccordionItem borderWidth={3} borderRadius={10} mb={3}>
		<BountySelect
			bountyId={bounty._id}
			selectedBounties={selectedBounties}
			setSelectedBounties={setSelectedBounties}
		/>
		<AccordionButton pb={5} pt={0}>
			<BountySummary bounty={bounty} />
			<Box
				pos="relative"
				textAlign="right"
				w={0}
				left={-4}
				top={{ base: -10, md: -5 }}
			>
				<AccordionIcon />
			</Box>
		</AccordionButton>
		<AccordionPanel mx={2}>
			<BountyDetails bounty={bounty} />
		</AccordionPanel>
	</AccordionItem>
);

export const BountyItem = ({
	initialBounty,
	selectedBounties,
	setSelectedBounties,
}: {
	initialBounty: BountyCollection;
	selectedBounties: string[];
	setSelectedBounties: SetState<string[]>;
}): JSX.Element => {
	const {
		isOpen: isBountyModalOpen,
		onOpen: onBountyModalOpen,
		onClose: onBountyModalClose,
	} = useDisclosure();
	const { bounty, isLoading } = useBounty(initialBounty._id);

	return (
		<Box w="100%" borderWidth={3} borderRadius={10} mb={1}>
			{isLoading ? (
				// if loading, show the loader
				<Box padding="6" boxShadow="lg">
					<SkeletonCircle size="10" />
					<SkeletonText mt="4" noOfLines={3} spacing="4" />
				</Box>
			) : bounty ? (
				<HStack>
					<BountySelect
						bountyId={bounty._id}
						selectedBounties={selectedBounties}
						setSelectedBounties={setSelectedBounties}
					/>
					<Box w="100%" pb={2} pt={0} onClick={onBountyModalOpen}>
						<BountySummary bounty={bounty} />
					</Box>
					<BountyModal
						isOpen={isBountyModalOpen}
						onClose={onBountyModalClose}
						bountyIn={bounty}
					/>
				</HStack>
			) : (
				<BountyNotFound />
			)}
		</Box>
	);
};
