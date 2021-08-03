import { Stack } from '@chakra-ui/react'
import Filters from './Filters'
import BountyList from './BountyList'
import useSWR from 'swr'

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data)

const Bounties = (): JSX.Element => {
  const { data: bounties, error } = useSWR(`/api/bounties`, fetcher)

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
      <BountyList bounties={bounties} />
    </Stack>
  )
}

export default Bounties
