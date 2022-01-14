import { Accordion } from '@chakra-ui/react';
import { BountyCollection } from '../../../../models/Bounty';
import { AccordionBountyItem } from '../Bounty';

type BountyListProps = {
  bounties: BountyCollection[]
}

const BountyList = ({ bounties }: BountyListProps): JSX.Element => {
	return (
		<Accordion allowToggle allowMultiple width={{ base: '95vw', lg: '700px' }}>
			{bounties && bounties.map(
				(bounty, idx) => (
					<AccordionBountyItem
						key={idx}
						bounty={bounty}
					/>
				)
			)}
		</Accordion>
	);
};

export default BountyList;
