import { Box, Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { BountyBoardProps } from '../../../../models/Bounty';
import Link from 'next/link';

export const BountyListItem = ({
	_id,
	title,
	description,
	status,
}: BountyBoardProps): JSX.Element => (
	<Link href={`/${_id}`}>
		<Flex
			flexWrap="wrap"
			width="100%"
			justifyContent="flex-end"
			px={5}
			pt={4}
			pb={4}
			pr={[0, '5']}
			borderWidth={{ base: '0px 0px 1px 0px', lg: '1px' }}
			borderRadius={{ base: 0, lg: 10 }}
			cursor="pointer"
			_hover={{
				borderWidth: { base: '1px 0px 1px 0px', lg: '1px' },
				borderColor: 'rgba(255,255,255, 0.8)',
				transition: 'border-color 0.2s ease-in-out',
			}}
		>
			<Box width={{ base: '100vw', lg: '700px' }} align="left">
				<Flex justifyContent="space-between" pr={{ base: '2', lg: '0' }}>
					<Heading
						w="100%"
						flex="1"
						fontFamily="Calibre Semi-Bold"
						fontWeight="500"
						fontSize={{ base: 25, lg: 28 }}
						pr={{ base: 5, lg: 0 }}
						mb={0}
						wordBreak="break-word"
					>
						{title}
					</Heading>

					<Flex
						display={{ base: 'none', lg: 'flex' }}
						alignItems="center"
						justifyContent="center"
						w="max"
						h={{ base: 6, lg: 7 }}
						px="4"
						ml={{ base: 2, lg: 5 }}
						borderRadius={100}
						fontFamily="Calibre Semi-Bold"
						fontWeight="400"
						fontSize={{ base: 12, lg: 15 }}
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
						<Text mt="-0.1rem">{status}</Text>
					</Flex>
				</Flex>
				<Box
					w="100%"
					maxWidth="100%"
					className="bounty-description"
					mt={{ base: 1, lg: 2 }}
					fontFamily="Calibre Medium"
					fontWeight="400"
					fontSize={{ base: 22, lg: 22 }}
					lineHeight={{ base: 1.3, lg: 1.3 }}
					pr={{ base: 5, lg: 10 }}
					color={useColorModeValue('#5f606a', '#8b949e')}
				>
					{description}
				</Box>
				<Flex display={{ base: 'flex', lg: 'none' }} h={7} my={1}>
					<Flex
						alignItems="center"
						justifyContent="center"
						h="100%"
						mt={1.5}
						pb={1}
						px="3"
						borderRadius={100}
						fontFamily="Calibre"
						fontWeight="400"
						fontSize={{ base: 16 }}
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
			</Box>
		</Flex>
	</Link>
);
