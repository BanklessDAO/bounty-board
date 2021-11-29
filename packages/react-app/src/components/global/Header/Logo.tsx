import React from 'react';
import { Box, BoxProps, Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';

export default function Logo(props: BoxProps): JSX.Element {
	return (
		<Box {...props}>
			<Link href={'/'}>
				<ChakraLink isExternal={false}>
					{/* <Image alt="Bankless DAO" src="/logo.png" /> */}
				</ChakraLink>
			</Link>
		</Box>
	);
}
