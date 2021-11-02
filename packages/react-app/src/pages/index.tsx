import Layout from '../components/global/SiteLayout';
import Bounties from '../components/pages/Bounties';
import { useContext } from 'react';
import { CustomerContext } from '../context/CustomerContext';

const Index = (): JSX.Element => {
	const { customer } = useContext(CustomerContext);
	return (
		<Layout
			title={`${customer.CustomerName ?? 'DAO'} Bounty Board`}
			props={{}}
		>
			<Bounties />
		</Layout>
	);
};

export default Index;
