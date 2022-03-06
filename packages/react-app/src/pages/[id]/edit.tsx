import React from 'react';
import { Heading, Stack } from '@chakra-ui/layout';
import Layout from '@app/components/global/SiteLayout';
import { useSession } from 'next-auth/react';
import EditBountyForm from '@app/components/pages/Bounties/Form/EditBountyForm';
import { useRouter } from 'next/router';
import { useBounty } from '@app/hooks/useBounties';
import { BountyLoader, BountyNotFound } from '.';

const EditBounty = (): JSX.Element => {
	const { status } = useSession({ required: false });
	const unauthorized = (status !== 'loading' && status !== 'authenticated');
	const router = useRouter();
	const { id } = router.query;
	const { bounty, isLoading, isError } = useBounty(id);
	return (
		<>{
			isLoading
				// if loading, show the loader
				? <BountyLoader />
				: bounty
					?
					// if not loading and we have a bounty, show the page
					<Layout title={unauthorized ? 'Not Authorized' : 'Edit Bounty'}>
						{
							unauthorized
								?	(
									<Stack align="center" justify="center" h="400px">
										<Heading size="4xl" alignItems="center">
											<strong>403</strong>
										</Heading>
										<Heading size="xl">Unauthorized - Sign In to Access</Heading>
									</Stack>
								)
							// if authorized after load and we have bounty, show the form
								: <EditBountyForm bounty={bounty} />
						}
					</Layout>
					// else, show the not found page
					: (id && isError) && <BountyNotFound />
		}
		</>
		
	);
};

export default EditBounty;