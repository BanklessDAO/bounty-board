import { BountyCard } from '@app/components/pages/Bounties/Bounty';
import Layout from '@app/components/global/SiteLayout';
import { Stack } from '@chakra-ui/layout';
import { BountyCollection } from '@app/models/Bounty';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useLocalStorage } from '@app/hooks/useLocalStorage';

export const BountyPage = (): JSX.Element => {
	const router = useRouter();
	const { data: bounty, loading } = useLocalStorage<BountyCollection>('previewBounty');
	useEffect(() => {
		if ((!loading && !bounty)) router.push('/create-bounty');
	}, [loading, bounty]);
	return (
		<Stack
			direction={{ base: 'column', lg: 'row' }}
			align="top"
			fontSize="sm"
			fontWeight="600"
			gridGap="4"
		>
			{ bounty && <BountyCard bounty={bounty} />}
		</Stack>
	);
};

const BountyPreviewLayout = (): JSX.Element => {
	return (
		<Layout title="Preview Bounty">
			<BountyPage />
		</Layout>
	);
};

export default BountyPreviewLayout;