import React from 'react';
import { Link } from '@chakra-ui/react';
import ColorModeButton from '@app/components/parts/ColorModeButton';

const BountyList = (): JSX.Element => {
	return (
		<Link
			aria-label="list-btn"
			href="/"
			w={{ base: '20em', md: 'auto' }}
			h={{ base: '2em', md: '2.6em' }}
		>
			<ColorModeButton
				w={{ base: '20em', md: 'auto' }}
				h={{ base: '3em', md: '2.6em' }}
			>
                  Bounty List
			</ColorModeButton>
		</Link>
	);
};

export default BountyList;
