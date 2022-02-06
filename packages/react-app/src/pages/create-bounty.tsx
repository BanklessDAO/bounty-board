import React from 'react';
import { Heading, Stack } from '@chakra-ui/layout';
import Layout from '@app/components/global/SiteLayout';
import { useSession } from 'next-auth/react';
import NewBountyForm from '@app/components/pages/Bounties/Form/NewBounty';

const CreateBounty = () => {
	const { status } = useSession({ required: false });
	const unauthorized = (status !== 'loading' && status !== 'authenticated');
	return (
		<Layout title={unauthorized ? 'Not Authorized' : 'Create a new Bounty'}>
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
					: <NewBountyForm />
			}
		</Layout>
	);
};

export default CreateBounty;
