import { Stack } from '@chakra-ui/react';
import { BountyBoardProps } from '../../../../models/Bounty';
import { BountyListItem } from '../BountyListItem';

type BountyListProps = {
	bounties: BountyBoardProps[];
};

const BountyList = ({ bounties }: BountyListProps): JSX.Element => {
	return (
		<Stack
			width={{ base: '100vw', lg: '700px' }}
			minWidth={{ lg: '700px' }}
			pt={{ base: 0, lg: 10 }}
			mt={-2}
			mb={{ base: 0, lg: bounties && bounties.length > 0 ? 20 : 0 }}
			spacing={{ base: 0, lg: 4 }}
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
						<BountyListItem
							key={_id}
							_id={_id}
							title={title}
							description={description}
							criteria={criteria}
							createdBy={createdBy}
							claimedBy={claimedBy}
							reward={reward}
							customer_id={''}
							status={status}
							discordMessageId={discordMessageId}
						/>
					)
				)}
		</Stack>
	);
};

export default BountyList;
