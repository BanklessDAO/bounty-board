import { Accordion } from '@chakra-ui/react'
import Bounty from './Bounty'

type BountyListProps = {
  bounties: any[]
}

const BountyList = ({ bounties }: BountyListProps): JSX.Element => {
  return (
    <Accordion allowToggle width={{ base: '95vw', lg: '700px' }}>
      {bounties.map(
        ({
          hash,
          title,
          description,
          criteria,
          author,
          claimed,
          reward,
          guilds,
          status,
        }) => (
          <Bounty
            key={hash}
            title={title}
            description={description}
            criteria={criteria}
            author={author}
            claimed={claimed}
            reward={reward}
            guilds={guilds}
            status={status}
          />
        )
      )}
    </Accordion>
  )
}

export default BountyList
