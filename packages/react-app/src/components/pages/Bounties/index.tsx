import { Button, Stack } from '@chakra-ui/react'
import Filters from './Filters'
import BountyAccordion from './BountyAccordion'
import useSWR from 'swr'
import { BountyCard } from './Bounty'
import React, { useState } from 'react'

export type PreFilterProps = {
  id?: string | string[]
}

export const PAGE_SIZE = 10

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data)

const Bounties = ({ id }: PreFilterProps): JSX.Element => {
  /* Bounties will fetch all data to start, unless a single bounty is requested */
  const [page, setPage] = useState(0)

  const incrementPage = () => {
    const numFullPages = Math.floor(bounties.length / PAGE_SIZE)
    const hasExtraPage = bounties.length % PAGE_SIZE != 0
    const maxPages = hasExtraPage ? numFullPages + 1 : numFullPages

    setPage(Math.min(page + 1, maxPages - 1)) //pages are 0 indexed
  }

  const decrementPage = () => {
    setPage(Math.max(page - 1, 0))
  }

  const { data: bounties, error } = useSWR(
    id ? `/api/bounties/${id}` : `/api/bounties`,
    fetcher
  )

  if (error) return <p>Failed to load</p>
  if (!bounties) return <p>Loading...</p>

  const paginatedBounties = bounties.slice(
    PAGE_SIZE * page,
    Math.min(bounties.length, PAGE_SIZE * (page + 1))
  )

  return (
    <>
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
          <BountyAccordion bounties={paginatedBounties} />
        </>
      )}
    </Stack>
    <Stack spacing={2} direction="row">
      <Button size="sm" colorScheme="teal" onClick={decrementPage}>
        Previous Page
      </Button>
      <Button size="sm" colorScheme="teal" onClick={incrementPage}>
        Next Page
      </Button>
    </Stack>
  </>
  )
}

export default Bounties
