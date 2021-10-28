import { CustomerProps } from '../types/Customer';
import Layout from '../components/global/SiteLayout';
import Bounties from '../components/pages/Bounties';

const Index = (props: {
	customer: CustomerProps,
	setCustomer(): void
}): JSX.Element => {
	return (
		<Layout
			title={`${props.customer.CustomerName ?? 'DAO'} Bounty Board`}
			customer={props.customer}
			setCustomer={props.setCustomer}
			props={{}}
		>
			<Bounties />
		</Layout>
	);
};

export default Index;
