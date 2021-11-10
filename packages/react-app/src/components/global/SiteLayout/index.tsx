import { Box, Stack, Heading } from '@chakra-ui/react';
import { ReactNode } from 'react';

import Header from '../Header';
import Footer from '../Footer';

type LayoutProps = {
  children: ReactNode
  title: string
}

const SiteLayout = ({ children, title }: LayoutProps): JSX.Element => {
	return (
		<>
			<Header />
			<Stack
				mx="10"
				mt="30"
				mb="10"
				transition="background 100ms linear"
				align="center"
				justify="center"
				bg="primary"
			>
				<Box>
					<Heading size="xl" as="h1" textAlign="center">
						{title}
					</Heading>
					{children}
				</Box>
			</Stack>
			<Footer />
		</>
	);
};

export default SiteLayout;
