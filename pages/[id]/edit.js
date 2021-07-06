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
    name: bounty.name,
    owner_name: bounty.owner_name,
    guild: bounty.guild,
    reward: bounty.reward,
    claimed: bounty.claimed,
    claimedBy: bounty.claimedBy,
    image_url: bounty.image_url,
    likes: bounty.likes,
    dislikes: bounty.dislikes,
  }

  return <Form formId="edit-bounty-form" bountyForm={bountyForm} forNewBounty={false} />
}

export default EditBounty
