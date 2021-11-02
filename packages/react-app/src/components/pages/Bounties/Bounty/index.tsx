import {
	AccordionButton,
	// AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Avatar,
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	Heading,
	// Tag,
	// TagLabel,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import AccessibleLink from '../../../parts/AccessibleLink';

import { BountyBoardProps } from '../../../../models/Bounty';
import { discordChannelUrl } from '../../../../constants/discordInfo';
// import { stat } from "fs";

// const Status = ({ indication }: { indication: string }): JSX.Element => (
// 	<Tag my={0} size="lg" key="lg" variant="outline" colorScheme={indication}>
// 		<TagLabel>{indication.replace('-', ' ')}</TagLabel>
// 	</Tag>
// );

const DiscordStub = ({ name }: { name: string }): JSX.Element => (
	<Flex my={2} align="center" gridGap={3}>
		<Avatar size="sm" src="https://bit.ly/broken-link" />
		<Text fontSize="md" color="steelblue">
			@{name}
		</Text>
	</Flex>
);

const BountySummary = ({
	title,
	description,
	// reward,
	status,
}: BountyBoardProps): JSX.Element => (
	<Flex flexWrap="wrap" width="100%" justifyContent="flex-end">
		<Box
			width={{ base: '100%', lg: '700px' }}
			pr={{ base: 7, md: 0 }}
			align="left"
		>
			<Heading fontSize={{ base: 24, lg: 28 }} mb={0} flex={{ base: 1, md: 0 }}>
				{title}
			</Heading>

			<Box
				className="bounty-description"
				mt={2}
				fontSize={{ base: 19, lg: 21 }}
				lineHeight={{ lg: 1.3 }}
				pr={10}
				color={useColorModeValue('#5f606a', '#8b949e')}
			>
				{description}
			</Box>
			<Box h="6" mt={1}>
				<Flex
					w="max"
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
				</Flex>
			</Box>
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
		<GridItem>
			<Heading size="sm">Requested By</Heading>
			<DiscordStub name={createdBy.discordHandle} />
		</GridItem>
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
					<DiscordStub name={claimedBy.discordHandle} />
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

export const BountyCard = (props: BountyBoardProps): JSX.Element => (
	<Box width={{ base: '95vw', lg: '700px' }}>
		<Box borderWidth={1} borderRadius={10}>
			<Box>
				<BountySummary {...props} />
			</Box>
			<Box>
				<BountyDetails {...props} />
			</Box>
		</Box>
	</Box>
);

export const AccordionBountyItem = (props: BountyBoardProps): JSX.Element => (
	<AccordionItem
		borderTopWidth={{ base: 0, lg: 1 }}
		borderBottomWidth={1}
		borderLeftWidth={{ base: 0, lg: 1 }}
		borderRightWidth={{ base: 0, lg: 1 }}
		borderRadius={{ lg: 10 }}
		py={4}
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
