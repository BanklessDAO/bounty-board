import { useRouter } from 'next/router';
import Layout from '../../components/global/SiteLayout';
import Bounties from '../../components/pages/Bounties';

const BountyPage = (): JSX.Element => {
	const router = useRouter();
	const { id } = router.query;
	return (
		<Layout title="DAO Bounty Board">
			<Bounties id={id} />
		</Layout>
	);
};

export default BountyPage;
