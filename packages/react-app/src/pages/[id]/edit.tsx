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
  if (bounty.status.toLowerCase() != "draft") {
    return <p>Bounty is no longer in draft state. Unauthorized to edit</p>
  } 

  const bountyForm = {
    title: bounty.title,
    description: bounty.Description,
    criteria: bounty.Criteria,
    reward: bounty.Reward,
    createdBy: bounty.CreatedBy,
    expiration: bounty.Expiration,
    season: bounty.Season,
  }

  return (
    <Form
      formId="edit-bounty-form"
      bountyForm={bountyForm}
      forNewBounty={false}
    />
  )
}

export default EditBounty
