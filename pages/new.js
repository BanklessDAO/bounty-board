import Form from '../components/Form'

const NewBounty = () => {
  const bountyForm = {
    bountyTitle: '',
    bountyDescription: '',
    bountyCriteria: '',
    bountyReward: 0,
    bountyGuild: '',
    bountyCreatedBy: '',
    bountyExpiration: '',
    bountyImage: ''
  }

  return <Form formId="add-bounty-form" bountyForm={bountyForm} />
}

export default NewBounty
