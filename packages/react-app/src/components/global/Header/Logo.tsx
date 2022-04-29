import { Box, Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';
import NextImage from 'next/image';
import { useMemo } from 'react';

const usePublicLogo = (img?: string) => useMemo(() => {
	/**
	 * https://nextjs.org/docs/basic-features/static-file-serving
	 * App will crash if a logo is passed but does not start with a slash
	 * It will also crash if a logo starts with 2 slashes
	 * It WILL work for `/./path/to/file.png`
	 */
	if (!img) return '/logo.png';
	let logo: string;
	if (img[0] === '/') {
		logo = img;
	} else if (img.slice(0, 2) === './') {
		logo = img.slice(1);
	} else {
		logo = '/' + img;
	}
	return logo;
}, [img]);

export default function Logo(props: { img?: string; alt?: string }): JSX.Element {
	const logo = usePublicLogo(props.img);
	return (
		<Box boxSize={{ base: '75px', md: '100px' }}>
			<Link href={'/'}>
				<ChakraLink isExternal={false}>
					<NextImage
						height={90}
						width={90}
						src={logo}
						alt={(props.alt ?? 'DAO') + ' Logo'}
					/>
				</ChakraLink>
			</Link>
		</Box>
	);
}
