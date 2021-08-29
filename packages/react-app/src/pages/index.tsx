import Layout from '../components/global/SiteLayout';
import Bounties from '../components/pages/Bounties';

const Index = (): JSX.Element => {
	return (
		<Layout title="DAO Bounty Board">
			<Bounties />
		</Layout>
	);
};

export default Index;
