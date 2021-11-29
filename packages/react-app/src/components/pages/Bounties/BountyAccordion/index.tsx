import { Accordion } from '@chakra-ui/react';
import { BountyBoardProps } from '../../../../models/Bounty';
import { AccordionBountyItem } from '../Bounty';

type BountyListProps = {
	bounties: BountyBoardProps[];
};

const BountyList = ({ bounties }: BountyListProps): JSX.Element => {
	return (
		<Accordion
			allowToggle
			allowMultiple
			width={{ base: '100vw', lg: '700px' }}
			minWidth={{ lg: '700px' }}
			pt={{ base: 0, lg: 10 }}
			mt="0rem !important"
		>
			{bounties &&
				bounties.map(
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
