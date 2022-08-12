import RestrictedTo from '@app/components/global/Auth';
import bountyStatus from '@app/constants/bountyStatus';
import { useRoles } from '@app/hooks/useRoles';
import { useUser } from '@app/hooks/useUser';
import { BountyCollection } from '@app/models/Bounty';
import { Button, Box, useColorMode } from '@chakra-ui/react';
import router from 'next/router';
import { useMemo } from 'react';

const useShowEditBountyButton = (bounty: BountyCollection): boolean => {
	const { user } = useUser();
	const roles = useRoles();
	const show = useMemo(() => {
		const isOpen = bounty.status === bountyStatus.OPEN;
		const isOwnBounty = bounty.createdBy.discordId === user?.id;
		const isAdmin = roles.includes('admin');
		return (isAdmin || isOwnBounty) && isOpen;
	}, [bounty, roles, user]);
	return show;
};

export const BountyEditButton: React.FC<{ bounty: BountyCollection }> = ({
	bounty,
}) => {
	const { colorMode } = useColorMode();
	const show = useShowEditBountyButton(bounty);
	return (
		<>
			{show && (
				<RestrictedTo roles={['edit-own-bounty', 'admin']}>
					<Box p={2}>
						<Button
							boxShadow={'md'}
							borderColor={colorMode === 'dark' ? 'primary.700' : 'primary.300'}
							size='md'
							width='200px'
							onClick={() => router.push(`/${bounty._id}/edit`)} >
                            Edit this bounty
						</Button>
					</Box>
				</RestrictedTo>
			)}
		</>
	);
};
