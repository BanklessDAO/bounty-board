import { useRouter } from 'next/router'
import useSWR from 'swr'
import Form from '../../components/Form'

const fetcher = (url) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data)

const EditBounty = () => {
  const router = useRouter()
  const { id } = router.query
  const { data: bounty, error } = useSWR(id ? `/api/bounties/${id}` : null, fetcher)

  if (error) return <p>Failed to load</p>
  if (!bounty) return <p>Loading...</p>

  const bountyForm = {
    bountyTitle: bountyForm.bountyTitle,
    bountyDescription: bountyForm.bountyDescription,
    bountyCriteria: bountyForm.bountyCriteria,
    bountyReward: bountyForm.bountyReward,
    bountyGuild: bountyForm.bountyGuild,
    bountyCreatedBy: bountyForm.createdBy,
    bountyExpiration: bountyForm.bountyExpiration,
    bountyImage: bountyForm.bountyImage,
  }

  return <Form formId="edit-bounty-form" bountyForm={bountyForm} forNewBounty={false} />
}

export default EditBounty
