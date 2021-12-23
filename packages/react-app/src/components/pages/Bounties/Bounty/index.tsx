/* eslint-disable no-inline-comments */
import React from 'react';
import {
	Box,
	Heading,
	Text,
	Link,
	Flex,
	Stack,
	Spacer,
} from '@chakra-ui/layout';
import { Skeleton, Icon, Image } from '@chakra-ui/react';

const Bounty = ({ bounty }: { bounty: any }): JSX.Element => {
	// bounty = null;
	console.log(bounty);

	return (
		<Flex
			direction={{ base: 'column', lg: 'row' }}
			alignItems={{ base: 'center', lg: 'flex-start' }}
			mb={10}
		>
			<Box w={{ base: '100vw' }} maxWidth={{ lg: '800px' }} py={6} px={6}>
				<Box gridGap={0}>
					<Link
						href={'/'}
						display="flex"
						gridGap={1.5}
						color="#646464"
						mb={bounty ? 3 : 5}
						style={{ textDecoration: 'none' }}
						boxShadow="none !important"
					>
						<Icon w={5} h={5}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M7 16l-4-4m0 0l4-4m-4 4h18"
								/>
							</svg>
						</Icon>
						<Heading
							as="h3"
							fontFamily="Calibre Semi-Bold"
							fontWeight="500"
							fontSize={17}
							my={0}
						>
							Back
						</Heading>
					</Link>
					{bounty ? (
						<>
							<Heading
								fontSize={35}
								mb={0}
								mt={{ base: 3, lg: 3 }}
								fontFamily="Calibre Semi-Bold"
							>
								{bounty.title}
							</Heading>
							<Flex
								w="100%"
								justifyContent="space-between"
								my={{ base: 3, lg: 5 }}
							>
								<Link
									display="flex"
									href={`https://discordapp.com/users/${bounty.createdBy.discordId}`}
									isExternal
									target="_blank"
									rel="noopener noreferrer"
									fontFamily="Calibre Medium"
									fontWeight="400"
									boxShadow="none !important"
								>
									{bounty.createdBy.iconUrl ? (
										<Image
											w={7}
											h={7}
											borderRadius={100}
											borderWidth={0}
											src={bounty.createdBy.iconUrl}
										></Image>
									) : (
										<Box w={7} h={7} borderRadius={100} bgColor="#333"></Box>
									)}
									<Flex alignItems="center" gridColumnGap={1.5} fontSize={20}>
										<Text
											h="max"
											mt="-0.25rem"
											maxWidth={40}
											whiteSpace="nowrap"
											overflow="hidden"
											textOverflow="ellipsis"
											ml={2.5}
										>
											{bounty.createdBy.discordHandle}
										</Text>
									</Flex>
								</Link>
								<Flex gridColumnGap={2} pr={4}>
									<Flex
										w="max"
										h="1.9rem"
										px="4"
										alignItems="center"
										justifyContent="center"
										borderRadius={100}
										fontFamily="Calibre"
										fontWeight="400"
										fontSize={17}
										bgColor={
											bounty.status === 'Open'
												? 'Open'
												: bounty.status === 'In-Review'
													? 'In-Review'
													: bounty.status === 'In-Progress'
														? 'In-Progress'
														: 'Completed'
										}
									>
										{bounty.status}
									</Flex>
								</Flex>
							</Flex>
							<Box
								fontSize={25}
								lineHeight={1.3}
								fontFamily="Calibre"
								fontWeight="400"
								color="#646464"
							>
								<Text>{bounty.description}</Text>
								<Text mt={3} mb={1} color="#e8e8e8">
									Criteria
								</Text>
								<Text>{bounty.criteria}</Text>
							</Box>
						</>
					) : (
						<Box>
							<Skeleton h="10" startColor="#323232" endColor="#4b4b4b" />
							<Skeleton
								h="10"
								w="80%"
								mt={3}
								startColor="#323232"
								endColor="#4b4b4b"
							/>
						</Box>
					)}
				</Box>
			</Box>
			{bounty ? (
				<Box
					mt={{ lg: 16 }}
					borderRadius={10}
					borderWidth={1}
					w="20rem"
					h="max"
				>
					<Stack
						spacing={1}
						h="max"
						gridRowGap={0}
						px={6}
						py={5}
						fontSize={20}
						fontFamily="Calibre"
						fontWeight="400"
					>
						<Flex>
							<Text color="#646464">Reward</Text>
							<Spacer></Spacer>
							<Text color="#e8e8e8">{bounty.reward.amount}</Text>
						</Flex>
						<Flex>
							<Text color="#646464">Currency</Text>
							<Spacer></Spacer>
							<Text color="#e8e8e8">{bounty.reward.currency}</Text>
						</Flex>
						<Flex>
							<Text color="#646464">Created</Text>
							<Spacer></Spacer>
							<Text color="#e8e8e8">2021-12-13</Text>
						</Flex>

						<Flex>
							<Text color="#646464">Due Date</Text>
							<Spacer></Spacer>
							<Text color="#e8e8e8">
								{new Date(Date.parse(bounty.createdAt)).toLocaleDateString(
									'en-US'
								)}
							</Text>
						</Flex>
					</Stack>
					<Flex
						alignItems="center"
						justifyContent="center"
						w="100%"
						h={12}
						borderTopWidth={1}
						fontFamily="Calibre"
						bgColor="#d4d4d4"
						color="#333"
						fontWeight="400"
						fontSize={18}
						borderBottomRadius={10}
						cursor="pointer"
					>
						Claim
					</Flex>
				</Box>
			) : (
				<Box w="20rem"></Box>
			)}
		</Flex>
	);
};

export default Bounty;
