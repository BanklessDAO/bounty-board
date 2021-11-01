import { useRouter } from 'next/router';
// import Layout from '../../components/global/SiteLayout';
import Bounties from '../../components/pages/Bounties';

const BountyPage = (): JSX.Element => {
	const router = useRouter();
	const { id } = router.query;
	return <Bounties id={id} />;
};

export default BountyPage;
