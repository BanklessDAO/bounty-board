import { Box, Image, Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';

export default function Logo(props: { img: string; alt: string }): JSX.Element {
	return (
		<Box py={4} h="100%">
			<Link href={'/'}>
				<ChakraLink isExternal={false}>
					<Image h="100%" alt={props.alt} src={props.img} />
				</ChakraLink>
			</Link>
		</Box>
	);
}
