import { Flex } from '@chakra-ui/layout';
import { useRouter } from 'next/router';
import Layout from '../../components/global/SiteLayout';
import Bounties from '../../components/pages/Bounties';

const BountyPage = (): JSX.Element => {
	const router = useRouter();
	const { id } = router.query;
	return (
		<Layout>
			<Flex align="center" justify="center">
				<Bounties id={id} />
			</Flex>
		</Layout>
	);
};

export default BountyPage;