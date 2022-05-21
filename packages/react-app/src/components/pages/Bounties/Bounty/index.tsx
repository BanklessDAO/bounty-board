import {
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Spacer,
	Box,
	Checkbox,
	Flex,
	Grid,
	GridItem,
	Heading,
	Tag,
	TagLabel,
	Text,
	HStack,
} from '@chakra-ui/react';
import { BountyCollection } from '@app/models/Bounty';
import BountyClaim from './claim';
import BountySubmit from './submit';
import { BountyEditButton } from './edit';
import UserAvatar from '@app/components/parts/UserAvatar';

type SetState<T extends any> = (arg: T) => void;

const Status = ({ bounty }: { bounty: BountyCollection }): JSX.Element => (
	<Tag my={0} size="lg" key="lg" variant="outline" colorScheme={bounty.status}>
		<Box ml={-1} mr={2} >
			<UserAvatar userId={bounty.claimedBy?.discordId} size='xs' />
		</Box>
		<TagLabel>{bounty.status.replace('-', ' ')}</TagLabel>
	</Tag>
);

const BountySelect = ({ selectedBounties, setSelectedBounties, bountyId }: {
	selectedBounties: string[],
	setSelectedBounties: SetState<string[]>,
	bountyId: string,
}): JSX.Element => {

	const updateSelectedBounties = (event: any): void => {
		const bId = event.target.value;
		if (!selectedBounties.includes(bId)) {
			setSelectedBounties([...selectedBounties, bId]);
		} else {
			setSelectedBounties(selectedBounties.filter((selectedBountyId) => {
				return selectedBountyId !== bId;
			}));
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

const DiscordStub = ({ name }: { name: string }): JSX.Element => (
	<Flex my={2} align="center" gridGap={3}>
		<Text fontSize="md" color="steelblue">
			@{name}
		</Text>
	</Flex>
);

const calculateReward = (_reward: BountyCollection['reward']): string => {
	return `${_reward.amount ?? 0} ${_reward.currency}`;
};


export const BountySummary = ({ bounty }: {bounty: BountyCollection}): JSX.Element => {
	
	return (
		<Flex flexWrap="wrap" width="100%" justifyContent="flex-end" pl="2" pr="2" >
			<Flex flexWrap="nowrap" width={{ base: '100%', md: '60%' }} mt="2" >
				<Box >
					<UserAvatar userId={bounty.createdBy?.discordId} size='sm' />
				</Box>
				<Box pl='2' width="100%">
					<Heading isTruncated mb={2} size="md" flex={{ base: 1, md: 0 }}>
						{bounty.title}
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
					for: {bounty.assign ? '@' + bounty.assignedName :
						  bounty.gate ? '@' + bounty.gate[0] : 'anyone'}
				</Box>
				<Spacer />
				<Box mb={2}>
					{bounty.status && <Status bounty={bounty} />}
				</Box>
			</Flex>
		</Flex>
	);
};

const BountyDetails = ({ bounty }: { bounty: BountyCollection }): JSX.Element => {
	const {
		_id,
		description,
		criteria,
		createdBy,
		claimedBy,
		createdAt,
		status,
		dueAt,
	} = bounty;
	return (
		<Grid gap={6}>
			{_id &&
				<GridItem>
					<Heading size="sm">Bounty ID</Heading>
					<Text>{_id}</Text>
				</GridItem>
			}
			<GridItem>
				<Heading size="sm">Created Date</Heading>
				<Text>{createdAt.substring(0, 10)}</Text>
			</GridItem>
			<GridItem>
				<Heading size="sm">Description</Heading>
				<Text>{description}</Text>
			</GridItem>
			<GridItem>
				<Heading size="sm">Done Criteria</Heading>
				<Text>{criteria}</Text>
			</GridItem>
			{dueAt &&
				<GridItem>
					<Heading size="sm">Deadline</Heading>
					<Text>{new Date(dueAt).toDateString()}</Text>
				</GridItem>
			}
			{
				createdBy
					? <GridItem>
						<Heading size="sm">Requested By</Heading>
						<DiscordStub name={createdBy.discordHandle as string} />
					</GridItem>
					: null
			}
			<GridItem>
				<Flex>{
					status && status.toLowerCase() === 'draft'
						? <BountySubmit bounty={bounty} />
						: claimedBy
							? (
								<Flex flexDirection={'column'} justifyContent="start">
									<Heading size="sm" my='0'>Claimed By</Heading>
									<DiscordStub name={claimedBy.discordHandle ?? 'Unknown'} />
								</Flex>
							)
							: status.toLowerCase() !== 'deleted' && <BountyClaim bounty={bounty} />
				}
				<Box ml="5">
					<BountyEditButton bounty={bounty} />
				</Box>
				</Flex>
			</GridItem>
		</Grid>
	);
};

export const BountyCard = ({ bounty }: { bounty: BountyCollection }): JSX.Element => {
	return (
		<Box width={{ base: '95vw', lg: '700px' }}>
			<Box borderWidth={3} borderRadius={10} mb={3} p={4}>
				<Box pb={5}>
					<BountySummary bounty={bounty} />
				</Box>
				<Box mx={2}>
					<BountyDetails bounty={bounty} />
				</Box>
			</Box>
		</Box>
	);
};

export const AccordionBountyItem = ({ bounty, selectedBounties, setSelectedBounties }: { bounty: BountyCollection, selectedBounties: string[], setSelectedBounties: SetState<string[]> }): JSX.Element => (
	<AccordionItem borderWidth={3} borderRadius={10} mb={3}>
		<BountySelect bountyId={bounty._id} selectedBounties={selectedBounties} setSelectedBounties={setSelectedBounties} />
		<AccordionButton pb={5} pt={0}>
			<BountySummary bounty={bounty} />
			<Box pos="relative" textAlign="right" w={0} left={-4} top={{ base: -10, md: -5 }}>
				<AccordionIcon />
			</Box>
		</AccordionButton>
		<AccordionPanel mx={2}>
			<BountyDetails bounty={bounty} />
		</AccordionPanel>
	</AccordionItem>
);

export const BountyItem = ({ bounty, selectedBounties, setSelectedBounties }: { bounty: BountyCollection, selectedBounties: string[], setSelectedBounties: SetState<string[]> }): JSX.Element => (
	<Box w='100%' borderWidth={3} borderRadius={10} mb={1}>
		<HStack>
			<BountySelect bountyId={bounty._id} selectedBounties={selectedBounties} setSelectedBounties={setSelectedBounties} />
			<Box w='100%' pb={2} pt={0}>
				<BountySummary bounty={bounty} />
			</Box>
		</HStack>
	</Box>
);
