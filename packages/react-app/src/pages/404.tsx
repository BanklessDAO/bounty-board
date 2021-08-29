import { Heading } from '@chakra-ui/react';
import Layout from '../components/global/SiteLayout';
import { Stack } from '@chakra-ui/react';

const Page404 = (): JSX.Element => (
	<Layout title="">
		<Stack align="center" justify="center" h="400px">
			<Heading size="4xl" align="center">
				<strong>404</strong>
			</Heading>
			<Heading size="xl">Page not found</Heading>
		</Stack>
	</Layout>
);

export default Page404;
