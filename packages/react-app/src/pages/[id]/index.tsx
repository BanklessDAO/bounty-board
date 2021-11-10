import { Flex } from '@chakra-ui/layout';
import { CustomerContext } from '../../context/CustomerContext';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import Layout from '../../components/global/SiteLayout';
import Bounties from '../../components/pages/Bounties';

const BountyPage = (): JSX.Element => {
	const router = useRouter();
	const { id } = router.query;
	const { customer } = useContext(CustomerContext);
	return (
		<Layout title={`${customer.customerName ?? 'DAO'} Bounty Board`}>
			<Flex align="center" justify="center">
				<Bounties id={id} />
			</Flex>
		</Layout>
	);
};

export default BountyPage;
