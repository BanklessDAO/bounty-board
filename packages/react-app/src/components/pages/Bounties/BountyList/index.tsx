import { Box } from '@chakra-ui/react';
import { BountyCollection } from '../../../../models/Bounty';
import { BountyItem } from '../Bounty';

type SetState<T extends any> = (arg: T) => void;

const BountyList = ({ bounties, selectedBounties, setSelectedBounties }: { bounties: BountyCollection[], selectedBounties: string[], setSelectedBounties: SetState<string[]> }): JSX.Element => {
	return (
		<Box width={{ base: '95vw', lg: '700px' }}>
			{bounties && bounties.map(
				(bounty, idx) => (
					<BountyItem
						key={idx}
						initialBounty={bounty}
						selectedBounties={selectedBounties}
						setSelectedBounties={setSelectedBounties}
					/>
				)
			)}
		</Box>
	);
};

export default BountyList;
