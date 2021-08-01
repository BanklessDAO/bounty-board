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

  const bountyForm = {
    bountyTitle: bounty.bountyTitle,
    bountyDescription: bounty.bountyDescription,
    bountyCriteria: bounty.bountyCriteria,
    bountyReward: bounty.bountyReward,
    bountyGuild: bounty.bountyGuild,
    bountyCreatedBy: bounty.bountyCreatedBy,
    bountyExpiration: bounty.bountyExpiration,
    bountyImage: bounty.bountyImage,
    bountySeason: bounty.bountySeason,
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