import Form from '../components/Form'

const NewBounty = () => {
  const bountyForm = {
    name: '',
    owner_name: '',
    guild: '',
    reward: 0,
    claimed: false,
    claimedBy: '',
    image_url: '',
    likes: [],
    dislikes: [],
  }

  return <Form formId="add-bounty-form" bountyForm={bountyForm} />
}

export default NewBounty
