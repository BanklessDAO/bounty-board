import { Stack } from '@chakra-ui/react'
import Filters from './Filters'
import BountyAccordion from './BountyAccordion'
import useSWR from 'swr'
import { BountyCard } from './Bounty'
import React, { useState } from 'react'
// import { Button } from '@chakra-ui/react'
// import { useClickable } from "@chakra-ui/clickable"

export type PreFilterProps = {
  id?: string | string[]
}

export const PAGE_SIZE = 10

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data)


const Bounties = ({ id }: PreFilterProps): JSX.Element => {
  const [page, setPage] = useState(0)

  const { data: count, error } = useSWR(
    `/api/bounties/numBounties`,
    fetcher
  )

  if (error) return <p>Failed to load</p>
  console.log(`num total bounties: ${count}`)

  const incrementPage = () => {
    setPage(Math.min(page + 1, Math.floor(count/PAGE_SIZE)))
  }

  const decrementPage = () => {
    setPage(Math.max(page - 1,0))
  }

  return (
    <>
      <PaginatedBounties id={id} page={page}/>
      {/* <Stack spacing={2} direction="row" align="center">
      <Button size="sm" colorScheme="teal" onClick={() => decrementPage}>Previous Page</Button>
        <Button size="sm" colorScheme="teal" onClick={() => incrementPage}>Next Page</Button>
      </Stack> */}
      <button onClick={decrementPage}>Previous Page</button>
      <button onClick={incrementPage}>Next Page</button>
    </>
  )
}


const PaginatedBounties = (props: any): JSX.Element => {
  /* Bounties will fetch all data to start, unless a single bounty is requested */
  
  const { data: bounties, error } = useSWR(
    props.id ? `/api/bounties/${props.id}` : `/api/bounties`,
    fetcher
  )

  console.log(props.page)

  if (error) return <p>Failed to load</p>
  if (!bounties) return <p>Loading...</p> 
  
  let correctedPage = props.page
  if (PAGE_SIZE*props.page > bounties.length) correctedPage=Math.floor(bounties.length/PAGE_SIZE)
  else if (props.page < 0) correctedPage = 0

  const paginatedBounties = bounties.slice(
    PAGE_SIZE*correctedPage, Math.min(bounties.length, PAGE_SIZE*(correctedPage+1)))
      
  return (
    <Stack
      direction={{ base: 'column', lg: 'row' }}
      align="top"
      fontSize="sm"
      fontWeight="600"
      gridGap="4"
    >
      {props.id ? (
        <BountyCard {...bounties} />
      ) : (
        <>
          <Filters />
          <BountyAccordion bounties={paginatedBounties} />
        </>
        
      )}
    </Stack>
  )
}

export default Bounties
