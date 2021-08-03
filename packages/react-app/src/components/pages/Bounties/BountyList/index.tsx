import { Accordion } from '@chakra-ui/react'
import { BountyBoardProps } from '../../../../models/Bounty'
import Bounty from './Bounty'

type BountyListProps = {
  bounties: BountyBoardProps[]
}

const BountyList = ({ bounties }: BountyListProps): JSX.Element => {
  return (
    <Accordion allowToggle width={{ base: '95vw', lg: '700px' }}>
      {bounties.map(
        ({
          _id,
          title,
          description,
          criteria,
          createdBy,
          claimedBy,
          reward,
          status,
        }) => (
          <Bounty
            key={_id}
            _id={_id}
            title={title}
            description={description}
            criteria={criteria}
            createdBy={createdBy}
            claimedBy={claimedBy}
            reward={reward}
            status={status}
          />
        )
      )}
    </Accordion>
  )
}

export default BountyList
