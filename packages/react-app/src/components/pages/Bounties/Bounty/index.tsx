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
	Stack,
	Text,
} from '@chakra-ui/react';
import AccessibleLink from '../../../parts/AccessibleLink';

import { BountyCollection } from '../../../../models/Bounty';
import { baseUrl } from '../../../../constants/discordInfo';
import Link from 'next/link';
import ColorModeButton from '../../../../components/parts/ColorModeButton';
import { getCustomerFromBountyId } from '../../../../context/CustomerContext';

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

const ClaimURL = (bountyId: BountyCollection['_id']): string | undefined => {
	console.log(`ClaimURL: ${bountyId}`);
	let url;
	const customer = getCustomerFromBountyId(bountyId);
	if (customer) {
		url = `${baseUrl}/${customer.customer_id}/${customer.bountyChannel}`;
		console.log('formed URL');
	}
	return url;
};

const BountySummary = ({
	title,
	reward,
	status,
}: Pick<BountyCollection, 'title' | 'reward' | 'status'>): JSX.Element => {
	
	const calculateReward = (_reward: typeof reward): string => {
		return `${_reward.amount / 10 ** _reward.scale ?? 0} ${_reward.currency}`;
	};
	
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
	claimedBy,
	status,
	discordMessageId,
}: BountyCollection): JSX.Element => (
	<Grid gap={6}>
		<GridItem>
			<Heading size="sm">HashID</Heading>
			<Text>{_id}</Text>
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
			createdBy &&
				<GridItem>
					<Heading size="sm">Requested By</Heading>
					<DiscordStub name={createdBy?.discordHandle ?? 'Discord User'} />
				</GridItem>
				
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
					<DiscordStub name={claimedBy?.discordHandle ?? 'Discord User'} />
				</>
			) : (
				<>
					<Heading size="sm">Claimed By</Heading>
					<AccessibleLink
						href={
							discordMessageId && ClaimURL(_id as string)
								? `${ClaimURL(_id as string)}/${discordMessageId}`
								: '/'
						}
					>
						<Button my={2} size="sm" colorScheme="green">
              Claim It
						</Button>
					</AccessibleLink>
				</>
			)}
		</GridItem>
	</Grid>
);

const BountyNotFound = (): JSX.Element => (
	<Stack align="center" justify="center" h="400px">
		<Heading size="4xl" align="center">
			<strong>404</strong>
		</Heading>
		<Box>
			<Heading size="xl">Bounty not found</Heading>
		</Box>
		<Link href='/'>
			<Box my="5">
				<ColorModeButton>Go Back</ColorModeButton>
			</Box>
		</Link>
	</Stack>
);

export const BountyCard = (props: BountyCollection): JSX.Element => {
	if (!props || Object.entries(props).length === 0) {
		return (<BountyNotFound />);
	}
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
