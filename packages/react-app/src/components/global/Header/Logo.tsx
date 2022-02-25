import { Box, Image, Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';

export default function Logo(props: { img: string; alt: string }): JSX.Element {
	return (
		<Box boxSize={{ base: '75px', md: '100px' }}>
			<Link href={'/'}>
				<ChakraLink isExternal={false}>
					<Image
						align={'left top'}
						fit={'contain'}
						alt={props.alt}
						src={props.img}
					/>
				</ChakraLink>
			</Link>
		</Box>
	);
}
