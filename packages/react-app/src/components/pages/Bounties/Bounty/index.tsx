import {
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Checkbox,
	Flex,
	Grid,
	GridItem,
	Heading,
	HStack,
	Tag,
	TagLabel,
	Text,
} from '@chakra-ui/react';
import { BountyCollection } from '@app/models/Bounty';
import BountyClaim from './claim';
import BountySubmit from './submit';
import { BountyEditButton } from './edit';
import PAID_STATUS from '@app/constants/paidStatus';
import DOMPurify from 'dompurify';
import { toHTML } from 'discord-markdown';
import ReactHtmlParser from 'react-html-parser';

type SetState<T extends any> = (arg: T) => void;

const Status = ({ indication }: { indication: string }): JSX.Element => (
	<Tag my={0} size="lg" key="lg" variant="outline" colorScheme={indication}>
		<TagLabel>{indication.replace('-', ' ')}</TagLabel>
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


const BountySummary = ({ bounty }: {bounty: BountyCollection}): JSX.Element => {
	let tags: string[] = [];
	
	if (bounty.tags?.channelCategory) {
		tags = tags.concat(bounty.tags.channelCategory);
	} if (bounty.tags?.text) {
		tags = tags.concat(bounty.tags.text);
	}
	
	return (
		<Flex flexWrap="wrap" width="100%" justifyContent="flex-end" ml="2">
			<Box
				width={{ base: '100%', md: '60%' }}
				pr={{ base: 7, md: 0 }}
				textAlign="left"
				mt="4"
			>
				<Heading mb={4} size="md" flex={{ base: 1, md: 0 }}>
					{bounty.title}
				</Heading>
			</Box>
			<Box
				width={{ base: '100%', md: '30%' }}
				textAlign={{ base: 'left', md: 'right' }}
				mt={{ base: 0, md: 4 }}
				ml="auto"
				pr={7}
			>
				{bounty.reward && (
					<Heading mt={1} size="md">
						{calculateReward(bounty.reward)}
					</Heading>
				)}
			</Box>
			<Flex width="full" justifyContent="space-between" alignItems="center">
				<Box mb={2}>
					{bounty.status && <Status indication={bounty.status} />}
				</Box>
			</Flex>
			<Flex width="full" justifyContent="space-between" alignItems="center">
				<Box mb={2}>
					{<Status indication={bounty.paidStatus ? bounty.paidStatus : PAID_STATUS.UNPAID} />}
				</Box>
			</Flex>
			<Flex width="full" justifyContent="space-between" alignItems="center">
				<Box mb={2}>
					<HStack spacing={2}>
						{tags.length && tags.map((tag) =>
							<>
								<Tag key={tag} size='md' colorScheme='purple' variant='subtle' borderRadius='full'>
									<TagLabel>{tag.replace('-', ' ')}</TagLabel>
								</Tag>
							</>
						)}
					</HStack>
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
				<Text className='md-desc'>{ ReactHtmlParser(DOMPurify.sanitize(toHTML(description || ''))) }</Text>
			</GridItem>
			<GridItem>
				<Heading size="sm">Done Criteria</Heading>
				<Text>{ ReactHtmlParser(DOMPurify.sanitize(toHTML(criteria || ''))) }</Text>
			</GridItem>
			{dueAt &&
				<GridItem>
					<Heading size="sm">Deadline</Heading>
					<Text className='md-desc'>{new Date(dueAt).toDateString()}</Text>
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
