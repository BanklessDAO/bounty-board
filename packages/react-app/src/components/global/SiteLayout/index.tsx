import { Box, Stack,
	// Heading 
} from '@chakra-ui/react';
import { ReactNode } from 'react';

import Header from '../Header';
import Footer from '../Footer';

// import { useColorModeValue } from "@chakra-ui/react";

type LayoutProps = {
  children: ReactNode;
};

const SiteLayout = ({ children }: LayoutProps): JSX.Element => {
	return (
		<Box>
			<Header />
			<Stack
				mx="10"
				align="center"
				justify="center"
				transition="background 100ms linear"
			>
				<Box>{children}</Box>
			</Stack>
			<Footer />
		</Box>
	);
};

export default SiteLayout;
