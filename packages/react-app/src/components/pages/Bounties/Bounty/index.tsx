import React from 'react';
import { Box, Heading, Text, Link, Flex } from '@chakra-ui/layout';
import { Skeleton, Icon } from '@chakra-ui/react';

const Bounty = ({ bounty }: any): JSX.Element => {
	console.log(bounty);

	return (
		<Box w={{ base: '100vw' }} py={6} px={6} fontFamily="Calibre Bold">
			<Box gridGap={0}>
				<Link
					href={'/'}
					display="flex"
					gridGap={1.5}
					color="#646464"
					mb={bounty ? 3 : 5}
					style={{ textDecoration: 'none' }}
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
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
					</Icon>
					<Heading as="h3" fontSize={20} my={0}>
						Back
					</Heading>
				</Link>
				{bounty ? (
					<>
						<Heading fontSize={35} mb={0}>
							{bounty.title}
						</Heading>
						<Box mt={2} mb={6}>
							<Flex
								w="max"
								h="7"
								px="4"
								alignItems="center"
								justifyContent="center"
								pt="0.2rem"
								borderRadius={100}
								fontSize={16}
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
						</Box>
						<Box
							fontSize={25}
							lineHeight={1.3}
							fontFamily="Calibre Bold"
							fontWeight="400"
							color="#646464"
						>
							<Text>{bounty.description}</Text>
							<Text mt={5} mb={1} color="#e8e8e8">
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
	);
};

export default Bounty;
