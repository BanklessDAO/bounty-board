import { useContext } from 'react';
import { useRouter } from 'next/router';
import { Stack, Heading, Link, Box } from '@chakra-ui/layout';
import { SkeletonCircle, SkeletonText } from '@chakra-ui/skeleton';
import { CustomerContext } from '../../context/CustomerContext';
import Layout from '../../components/global/SiteLayout';
import { BountyCard } from '../../components/pages/Bounties/Bounty';
import { useBounty } from '../../hooks/useBounties';
import ColorModeButton from '../../components/parts/ColorModeButton';
import { useCustomerFromBountyIdAndKey } from '@app/hooks/useCustomer';

export const BountyNotFound = (): JSX.Element => (
	<Stack align="center" justify="center" h="400px">
		<Heading size="4xl" justifyContent="center">
			<strong>404</strong>
		</Heading>
		<Box>
			<Heading size="xl">Bounty not found</Heading>
		</Box>
		<Link href='/'>
			<Box my="5">
				<ColorModeButton>Go Back</ColorModeButton>
			</Box>
		</Link>
	</Stack>
);

export const BountyLoader = (): JSX.Element => (
	<Box padding='6' boxShadow='lg'>
		<SkeletonCircle size='10' />
		<SkeletonText mt='4' noOfLines={10} spacing='4' />
	</Box>
);

export const BountyPage = (): JSX.Element => {
	const router = useRouter();
	const { id, customerKey } = router.query;
	const { bounty, isLoading, isError } = useBounty(id);
	const { customer, isLoading: isCustomerLoading } = useCustomerFromBountyIdAndKey(id, customerKey);
	return (
		<>{
			isLoading || isCustomerLoading
				? <BountyLoader />
				: bounty && customer ?
					<Stack
						direction={{ base: 'column', lg: 'row' }}
						align="top"
						fontSize="sm"
						fontWeight="600"
						gridGap="4"
					>
						<BountyCard bounty={bounty} />
					</Stack>

					: ((id && !customer) || (id && isError))
					&& <BountyNotFound />

		}</>
	);
};

const BountyPageLayout = (): JSX.Element => {
	const { customer } = useContext(CustomerContext);

	return (
		<Layout title={`${customer.customerName ?? 'DAO'} Bounty Board`}>
			<BountyPage />
		</Layout>
	);
};

export default BountyPageLayout;
