import React from 'react';
import { Link } from '@chakra-ui/react';
import RestrictedTo from '@app/components/global/Auth';
import ColorModeButton from '@app/components/parts/ColorModeButton';

/**
 * Dev: rate limits in discord api mean this button can fail to render
 * Even if the user should have permissions. We will be addressing this in upcoming releases
 */
const NewBounty = (): JSX.Element => {
	return (
		<RestrictedTo roles={['create-bounty', 'admin']}>
			<Link
				aria-label="create-bounty-btn"
				href="/create-bounty"
				w={{ base: '20em', md: 'auto' }}
				h={{ base: '2em', md: '2.6em' }}
			>
				<ColorModeButton
					w={{ base: '20em', md: 'auto' }}
					h={{ base: '3em', md: '2.6em' }}
				>
                  New Bounty
				</ColorModeButton>
			</Link>
		</RestrictedTo>
	);
};

export default NewBounty;
