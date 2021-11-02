import { Box, Stack, Heading } from '@chakra-ui/react';
import { ReactNode } from 'react';

import Header from '../Header';
import Footer from '../Footer';

type LayoutProps = {
  children: ReactNode
  title: string
  props: any
}

const SiteLayout = ({ children, title, props }: LayoutProps): JSX.Element => {
	return (
		<>
			<Header
				props={props}/>
			<Stack
				mx="10"
				mt="30"
				mb="10"
				align="center"
				justify="center"
				transition="background 100ms linear"
				bg="primary"
			>
				<Box>
					<Heading size="xl" as="h1">
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
