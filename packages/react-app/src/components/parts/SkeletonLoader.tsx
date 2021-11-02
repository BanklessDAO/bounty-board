/* eslint-disable no-empty-pattern */
/* eslint-disable no-inline-comments */
import { Box, Skeleton } from '@chakra-ui/react';
// import handleViewport from 'react-in-viewport';

const SkeletonLoader = ({}: // incrementPage,
{
	// incrementPage: void;
}): JSX.Element => {
	return (
		<Box
			w={['100%', '700px']}
			borderRadius={{ base: 0, lg: 10 }}
			borderTopWidth={{ base: 0, lg: 1 }}
			borderBottomWidth={1}
			borderLeftWidth={{ base: 0, lg: 1 }}
			borderRightWidth={{ base: 0, lg: 1 }}
			px={5}
			py={5}
			pr={[0, '10']}
			mb="10"
		>
			<Skeleton
				h="8"
				w={{ base: 40, lg: 60 }}
				startColor="#323232"
				endColor="#4b4b4b"
			/>
			<Skeleton h="4" mt={4} w="90%" startColor="#323232" endColor="#4b4b4b" />
			<Skeleton h="4" mt={2} w="80%" startColor="#323232" endColor="#4b4b4b" />
			<Skeleton h="4" mt={2} w="85%" startColor="#323232" endColor="#4b4b4b" />
		</Box>
	);
};

export default SkeletonLoader;
