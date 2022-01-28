import {
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	Heading,
	Tag,
	TagLabel,
	Text,
} from '@chakra-ui/react';
import AccessibleLink from '../../../parts/AccessibleLink';
import { BountyCollection } from '../../../../models/Bounty';
import { baseUrl } from '../../../../constants/discordInfo';
import { CustomerContext } from '@app/context/CustomerContext';
import { useContext } from 'react';

const Status = ({ indication }: { indication: string }): JSX.Element => (
	<Tag my={0} size="lg" key="lg" variant="outline" colorScheme={indication}>
		<TagLabel>{indication.replace('-', ' ')}</TagLabel>
	</Tag>
);

const DiscordStub = ({ name }: { name: string }): JSX.Element => (
	<Flex my={2} align="center" gridGap={3}>
		<Text fontSize="md" color="steelblue">
      @{name}
		</Text>
	</Flex>
);

const calculateReward = (_reward: BountyCollection['reward']): string => {
	return `${(_reward.amount ?? 0) / (10 ** (_reward.scale ?? 0))} ${_reward.currency}`;
};

const BountySummary = ({
	title,
	reward,
	status,
}: Pick<BountyCollection, 'title' | 'reward' | 'status'>): JSX.Element => {
	
	return (
		<Flex flexWrap="wrap" width="100%" justifyContent="flex-end" ml="2">
			<Box
				width={{ base: '100%', md: '60%' }}
				pr={{ base: 7, md: 0 }}
				align="left"
				mt="4"
			>
				<Heading mb={4} size="md" flex={{ base: 1, md: 0 }}>
					{title}
				</Heading>
			</Box>
			<Box
				width={{ base: '50%', md: '30%' }}
				textAlign={{ base: 'left', md: 'right' }}
				mt={{ base: 0, md: 4 }}
				ml="auto"
				pr={7}
			>
				{reward && (
					<Heading mt={1} size="md">
						{calculateReward(reward)}
					</Heading>
				)}
			</Box>
			<Box mb={2} width="50%" textAlign={{ base: 'right', md: 'left' }}>
				{status && <Status indication={status} />}
			</Box>
			<Box
				width={{ base: '100%', md: '50%' }}
				textAlign={{ base: 'left', md: 'right' }}
				pr={7}
			>
			</Box>
		</Flex>
	);
};

const BountyDetails = ({
	_id,
	description,
	criteria,
	createdBy,
	createdAt,
	claimedBy,
	status,
	discordMessageId,
}: BountyCollection): JSX.Element => {
	const { customer: { customer_id, bountyChannel } } = useContext(CustomerContext);
	const url = discordMessageId ? `${baseUrl}/${customer_id}/${bountyChannel}/${discordMessageId}` : '/';
	return (
		<Grid gap={6}>
			<GridItem>
				<Heading size="sm">HashID</Heading>
				<Text>{_id}</Text>
			</GridItem>
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
			{
				createdBy
					? <GridItem>
						<Heading size="sm">Requested By</Heading>
						<DiscordStub name={createdBy.discordHandle as string} />
					</GridItem>
					: null
			}
			<GridItem>
				{status && status.toLowerCase() === 'draft' ? (
					<AccessibleLink href={`${_id}/edit`}>
						<Button my={2} size="sm" colorScheme="red">
							Edit This Draft
						</Button>
					</AccessibleLink>
				) : claimedBy ? (
					<>
						<Heading size="sm">Claimed By</Heading>
						<DiscordStub name={claimedBy.discordHandle ?? 'Unknown'} />
					</>
				) : (
					<>
						<Heading size="sm">Claimed By</Heading>
						<AccessibleLink href={url}>
							<Button my={2} size="sm" colorScheme="green">
								Claim It
							</Button>
						</AccessibleLink>
					</>
				)}
			</GridItem>
		</Grid>
	);
};

export const BountyCard = (props: BountyCollection): JSX.Element => {
	return (
		<Box width={{ base: '95vw', lg: '700px' }}>
			<Box borderWidth={3} borderRadius={10} mb={3} p={4}>
				<Box pb={5}>
					<BountySummary {...props} />
				</Box>
				<Box mx={2}>
					<BountyDetails {...props} />
				</Box>
			</Box>
		</Box>
	);
};

export const AccordionBountyItem = ({ bounty }: { bounty: BountyCollection }): JSX.Element => (
	<AccordionItem borderWidth={3} borderRadius={10} mb={3}>
		<AccordionButton pb={5}>
			<BountySummary
				title={bounty.title}
				reward={bounty.reward}
				status={bounty.status}
			/>
			<Box pos="relative" textAlign="right" w={0} left={-4} top={-7}>
				<AccordionIcon />
			</Box>
		</AccordionButton>
		<AccordionPanel mx={2}>
			<BountyDetails {...bounty} />
		</AccordionPanel>
	</AccordionItem>
);
