import { Stack } from '@chakra-ui/react'
import Filters from './Filters'
import BountyAccordion from './BountyAccordion'
import useSWR from 'swr'
import { BountyCard } from './Bounty'

export type PreFilterProps = {
  id?: string | string[]
}

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data)

const Bounties = ({ id }: PreFilterProps): JSX.Element => {
  /* Bounties will fetch all data to start, unless a single bounty is requested */
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
      {id ? (
        <BountyCard {...bounties} />
      ) : (
        <>
          <Filters />
          <BountyAccordion bounties={bounties} />
        </>
      )}
    </Stack>
  )
}

export default Bounties
