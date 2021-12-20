/* eslint-disable no-inline-comments */
import React from 'react';
import { Box, Heading, Text, Link, Flex } from '@chakra-ui/layout';
import { Skeleton, Icon, Image, Button } from '@chakra-ui/react';

const Bounty = ({ bounty }: { bounty: any }): JSX.Element => {
	console.log(bounty);

	return (
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
							mt={{ base: 3, lg: 5 }}
							fontFamily="Calibre Semi-Bold"
						>
							{bounty.title}
						</Heading>
						<Flex
							w="100%"
							justifyContent="space-between"
							my={{ base: 3, lg: 5 }}
						>
							<Flex fontFamily="Calibre Medium" fontWeight="400">
								<Image
									w={7}
									h={7}
									borderRadius={100}
									src={bounty.createdBy.iconUrl}
								></Image>
								<Flex alignItems="center" gridColumnGap={1.5} fontSize={20}>
									<Text
										h="max"
										maxWidth={40}
										whiteSpace="nowrap"
										overflow="hidden"
										textOverflow="ellipsis"
										ml={3}
									>
										{bounty.createdBy.discordHandle}
									</Text>
									{/* <Text fontSize={13}>●</Text>
									<Text>
										{bounty.reward.amount} {bounty.reward.currency}
									</Text> */}
								</Flex>
							</Flex>

							<Flex gridColumnGap={2}>
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
							fontWeight="500"
							color="#646464"
						>
							<Text>{bounty.description}</Text>
							<Text mt={3} mb={1} color="#e8e8e8">
								Criteria
							</Text>
							<Text>{bounty.criteria}</Text>
						</Box>
						<Button
							size="md"
							px={5}
							bgColor="#e8e8e8"
							color="#333"
							borderRadius={100}
							borderWidth={1}
							mt={5}
							fontSize={18}
							fontFamily="Calibre Semi-Bold"
							fontWeight="400"
						>
							Claim
						</Button>
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
	);
};

export default Bounty;
