/* eslint-disable no-inline-comments */
import {
	AccordionButton,
	AccordionItem,
	AccordionPanel,
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	Heading,
	Stack,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import AccessibleLink from '../../../parts/AccessibleLink';

import { BountyBoardProps } from '../../../../models/Bounty';
import { discordChannelUrl } from '../../../../constants/discordInfo';
import Link from 'next/link';
import ColorModeButton from '../../../../components/parts/ColorModeButton';

// const Status = ({ indication }: { indication: string }): JSX.Element => (
// 	<Tag my={0} size="lg" key="lg" variant="outline" colorScheme={indication}>
// 		<TagLabel>{indication.replace('-', ' ')}</TagLabel>
// 	</Tag>
// );

const DiscordStub = ({ name }: { name: string }): JSX.Element => (
	<Flex my={2} align="center" gridGap={3}>
		<Text fontSize="md" color="steelblue">
			@{name}
		</Text>
	</Flex>
);

const BountySummary = ({
	title,
	description,
	status,
}: // reward,
//  createdBy
BountyBoardProps): JSX.Element => (
	<Flex flexWrap="wrap" width="100%" justifyContent="flex-end">
		<Box width={{ base: '100vw', lg: '700px' }} align="left">
			<Flex justifyContent="space-between" pr={{ base: '2', lg: '2' }}>
				<Heading
					w="100%"
					flex="1"
					fontSize={{ base: 24, lg: 28 }}
					mb={0}
					wordBreak="break-word"
				>
					{title}
				</Heading>

				<Flex
					display={{ base: 'none', lg: 'flex' }}
					w="max"
					h="6"
					px="3"
					pt="0.15em"
					ml={{ base: 2, lg: 5 }}
					borderRadius={100}
					bgColor={
						status === 'Open'
							? 'Open'
							: status === 'In-Review'
								? 'In-Review'
								: status === 'In-Progress'
									? 'In-Progress'
									: 'Completed'
					}
				>
					{status}
				</Flex>
			</Flex>
			<Box
				className="bounty-description"
				mt={{ base: 1, lg: 2 }}
				fontSize={{ base: 22, lg: 21 }}
				lineHeight={{ base: 1.3, lg: 1.3 }}
				pr={{ base: 5, lg: 10 }}
				color={useColorModeValue('#5f606a', '#8b949e')}
			>
				{description}
			</Box>
			<Flex display={{ base: 'flex', lg: 'none' }} h="6" my={1}>
				<Box
					h="100%"
					px="3"
					pt="0.15em"
					borderRadius={100}
					bgColor={
						status === 'Open'
							? 'Open'
							: status === 'In-Review'
								? 'In-Review'
								: status === 'In-Progress'
									? 'In-Progress'
									: 'Completed'
					}
				>
					{status}
				</Box>
			</Flex>
		</Box>
	</Flex>
);

const BountyDetails = ({
	_id,
	description,
	criteria,
	createdBy,
	claimedBy,
	status,
	discordMessageId,
}: BountyBoardProps): JSX.Element => (
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
			createdBy
				? <GridItem>
					<Heading size="sm">Requested By</Heading>
					<DiscordStub name={createdBy.discordHandle} />
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
					<DiscordStub name={claimedBy?.discordHandle} />
				</>
			) : (
				<>
					<Heading size="sm">Claimed By</Heading>
					<AccessibleLink
						href={
							discordMessageId
								? `${discordChannelUrl}/${discordMessageId}`
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

export const BountyCard = (props: BountyBoardProps): JSX.Element => {
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

export const AccordionBountyItem = (props: BountyBoardProps): JSX.Element => (
	<AccordionItem
		borderTopWidth={{ base: 0, lg: 1 }}
		borderBottomWidth={1}
		borderLeftWidth={{ base: 0, lg: 1 }}
		borderRightWidth={{ base: 0, lg: 1 }}
		borderRadius={{ lg: 10 }}
		pt={{ base: 3, lg: 4 }}
		pb={2}
		pl={{ base: 1.5, lg: 2 }}
		mb={{ lg: 5 }}
	>
		<AccordionButton>
			<BountySummary {...props} />
		</AccordionButton>
		<AccordionPanel>
			<BountyDetails {...props} />
		</AccordionPanel>
	</AccordionItem>
);
