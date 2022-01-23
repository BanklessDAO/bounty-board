import React from 'react';
import { Link, Box } from '@chakra-ui/react';
import ColorModeButton from '@app/components/parts/ColorModeButton';
import RestrictedTo from '@app/components/global/Auth';

/**
 * Dev: rate limits in discord api mean this button can fail to render
 * Even if the user should have permissions. We will be addressing this in upcoming releases
 */
const NewBounty = (): JSX.Element => {
	return (
		<RestrictedTo roles={['create-bounty']}>
			<Link
				aria-label="create-bounty-btn"
				href='/create-bounty'
			>
				<Box my="5">
					<ColorModeButton>New Bounty</ColorModeButton>
				</Box>
			</Link>
		</RestrictedTo>
	);
};

export default NewBounty;