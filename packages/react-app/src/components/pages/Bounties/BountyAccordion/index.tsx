import { Accordion } from '@chakra-ui/react';
import { BountyBoardProps } from '../../../../models/Bounty';
import { AccordionBountyItem } from '../Bounty';

type BountyListProps = {
  bounties: BountyBoardProps[]
}

const BountyList = ({ bounties }: BountyListProps): JSX.Element => {
	return (
		<Accordion allowToggle allowMultiple width={{ base: '95vw', lg: '700px' }}>
			{bounties && bounties.map(
				({
					_id,
					title,
					description,
					criteria,
					createdBy,
					claimedBy,
					reward,
					status,
					discordMessageId,
				}) => (
					<AccordionBountyItem
						key={_id}
						_id={_id}
						title={title}
						description={description}
						criteria={criteria}
						createdBy={createdBy}
						claimedBy={claimedBy}
						reward={reward}
						status={status}
						discordMessageId={discordMessageId}
					/>
				)
			)}
		</Accordion>
	);
};

export default BountyList;
