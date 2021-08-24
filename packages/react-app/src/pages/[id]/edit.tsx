import { useRouter } from 'next/router';
import useSWR from 'swr';
import Form from '../../components/pages/Bounties/Form';
import Layout from '../../components/global/SiteLayout';
import { Box } from '@chakra-ui/react';

const fetcher = (url: string) =>
	fetch(url)
		.then((res) => res.json())
		.then((json) => json.data);

const EditBounty = (): JSX.Element => {
	const router = useRouter();
	const { id, key } = router.query;
	const { data: bounty, error } = useSWR(
		id ? `/api/bounties/${id}?key=${key}` : null,
		fetcher
	);

	if (error) return <p>Failed to load</p>;
	if (!bounty) return <p>Loading...</p>;

	return (
		<Layout title="Bounty Draft">
			<Box w={{ base: '90vw', md: 700 }}>
				<Form bountyForm={bounty} />
			</Box>
		</Layout>
	);
};

export default EditBounty;
