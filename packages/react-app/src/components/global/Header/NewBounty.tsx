import React from 'react';
import { Link, Box } from '@chakra-ui/react';
import ColorModeButton from '@app/components/parts/ColorModeButton';
import RestrictedTo from '@app/components/global/Auth';

const NewBounty = () => {
	return (
		<RestrictedTo roles={['create-bounty']}>
			<Link
				aria-label="create-bounty-btn"
				href='/new'
			>
				<Box my="5">
					<ColorModeButton>New Bounty</ColorModeButton>
				</Box>
			</Link>
		</RestrictedTo>
	);
};

export default NewBounty;