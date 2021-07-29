import { Stack } from '@chakra-ui/react'
import Filters from './Filters'
import BountyList from './BountyList'

type BountiesProps = {
  bounties: any[]
}

const Bounties = ({ bounties }: BountiesProps): JSX.Element => {
  return (
    <Stack
      direction={{ base: 'column', lg: 'row' }}
      align="top"
      fontSize="sm"
      fontWeight="600"
      gridGap="4"
    >
      <Filters />
      <BountyList bounties={bounties} />
    </Stack>
  )
}

export default Bounties
