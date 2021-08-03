import { Stack } from '@chakra-ui/react'
import Filters from './Filters'
import BountyList from './BountyList'
import useSWR from 'swr'

export type FilterProps = {
  id?: string | string[]
}

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data)

const Bounties = ({ id }: FilterProps): JSX.Element => {
  /* Bounties will fetch all data to start, unless prefiltering is set */
  const { data: bounties, error } = useSWR(
    id ? `/api/bounties/${id}` : `/api/bounties`,
    fetcher
  )

  if (error) return <p>Failed to load</p>
  if (!bounties) return <p>Loading...</p>

  return (
    <Stack
      direction={{ base: 'column', lg: 'row' }}
      align="top"
      fontSize="sm"
      fontWeight="600"
      gridGap="4"
    >
      <Filters />
      {id ? (
        <BountyList bounties={[bounties]} />
      ) : (
        <BountyList bounties={bounties} />
      )}
    </Stack>
  )
}

export default Bounties
