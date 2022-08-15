import RestrictedTo from '@app/components/global/Auth';
import bountyStatus from '@app/constants/bountyStatus';
import { useRoles } from '@app/hooks/useRoles';
import { useUser } from '@app/hooks/useUser';
import { BountyCollection } from '@app/models/Bounty';
import { Button, Box, useColorMode, Tooltip } from '@chakra-ui/react';
import { useMemo } from 'react';

const useShowDeleteBountyButton = (bounty: BountyCollection): boolean => {
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

export const BountyDeleteButton: React.FC<{ bounty: BountyCollection }> = ({
	bounty,
}) => {
	const { colorMode } = useColorMode();
	const show = useShowDeleteBountyButton(bounty);
	return (
		<>
			{show && (
				<RestrictedTo roles={['delete-own-bounty', 'admin']}>
					<Tooltip
						hasArrow
						label='Not implemented Yet'
						shouldWrapChildren
						mt="3"
					>
						<Box p={2}>
							<Button
								boxShadow={'md'}
								borderColor={colorMode === 'dark' ? 'primary.700' : 'primary.300'}
								size='md'
								width='200px'
							>
                             Delete this bounty
							</Button>
						</Box>
					</Tooltip>
				</RestrictedTo>
			)}
		</>
	);
};
