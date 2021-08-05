import { useRouter } from 'next/router'
import useSWR from 'swr'
import Form from '../../components/pages/Bounties/Form'

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data)

const EditBounty = (): JSX.Element => {
  const router = useRouter()
  const { id } = router.query
  const { data: bounty, error } = useSWR(
    id ? `/api/bounties/${id}` : null,
    fetcher
  )

  if (error) return <p>Failed to load</p>
  if (!bounty) return <p>Loading...</p>
  // if (bounty.status.toLowerCase() != 'draft') {
  //   return <p>Bounty is no longer in draft state. Unauthorized to edit</p>
  // }

  return <Form bountyForm={bounty} />
}

export default EditBounty
