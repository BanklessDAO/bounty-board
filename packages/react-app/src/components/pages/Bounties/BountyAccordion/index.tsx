import { Accordion } from '@chakra-ui/react';
import { BountyCollection } from '../../../../models/Bounty';
import { AccordionBountyItem } from '../Bounty';

type SetState<T extends any> = (arg: T) => void;

const BountyList = ({
	bounties,
	selectedBounties,
	setSelectedBounties,
}: {
  bounties: BountyCollection[];
  selectedBounties: string[];
  setSelectedBounties: SetState<string[]>;
}): JSX.Element => {
	return (
		<Accordion allowToggle allowMultiple width={{ base: '95vw', lg: '70vw' }}>
			{bounties &&
        bounties.map((bounty, idx) => (
        	<AccordionBountyItem
        		key={idx}
        		bounty={bounty}
        		selectedBounties={selectedBounties}
        		setSelectedBounties={setSelectedBounties}
        	/>
        ))}
		</Accordion>
	);
};

export default BountyList;
