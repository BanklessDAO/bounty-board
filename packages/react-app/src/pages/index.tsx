import Layout from '../components/global/SiteLayout'
import dbConnect from '../utils/dbConnect'
import Bounties from '../components/pages/Bounties'
import Bounty from '../models/Bounty'

type IndexProps = {
  bounties: any[]
}

const Index = ({ bounties }: IndexProps): JSX.Element => {
  return (
    <Layout title="DAO Bounty Board">
      <Bounties bounties={bounties} />
    </Layout>
  )
}

/* Retrieves bounty(s) data from mongodb database */
export async function getServerSideProps(): Promise<{
  props: IndexProps
}> {
  await dbConnect()

  /* find all the data in our database */
  const result = await Bounty.find({})
  const bounties = result.map((doc) => {
    const bounty = doc.toObject()
    bounty._id = bounty._id.toString()
    return bounty
  })

  return { props: { bounties: bounties } }
}

export default Index
