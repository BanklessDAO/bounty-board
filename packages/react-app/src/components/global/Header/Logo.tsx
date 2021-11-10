import { Box, Image, Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';

export default function Logo(props: { img: string, alt: string }): JSX.Element {
	return (
		<Box w="100px" h="50px">
			<Link href={'/'} >
				<ChakraLink isExternal={false}>
					<Image
						alt={props.alt}
						src={props.img}
					/>
				</ChakraLink>
			</Link>
		</Box>
	);
}
