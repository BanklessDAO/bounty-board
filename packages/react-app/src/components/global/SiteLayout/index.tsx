import {
	Box,
	Stack,
	Flex,
	// Heading
} from '@chakra-ui/react';
import { ReactNode } from 'react';

// import Sidebar from '../Sidebar';
import Header from '../Header';
import Footer from '../Footer';

// import { useColorModeValue } from "@chakra-ui/react";

type LayoutProps = {
	children: ReactNode;
};

const SiteLayout = ({ children }: LayoutProps): JSX.Element => {
	return (
		<Flex>
			{/* <Sidebar /> */}
			<Box flex="1">
				<Header />
				<Stack
					align="center"
					justify="center"
					transition="background 100ms linear"
				>
					<Box>{children}</Box>
				</Stack>
				<Footer />
			</Box>
		</Flex>
	);
};

export default SiteLayout;
