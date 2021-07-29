import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dbConnect from '../../utils/dbConnect'
import Bounty from '../../models/Bounty'

type BountyPageProps = {
  bounty: {
    _id: any
    bountyImage: any
    bountyTitle: any
    createdBy: any
    bountyReward: any
    bountyGuild: any
  }
}

/* Allows you to view bounty card info and delete bounty card*/
const BountyPage = ({ bounty }: BountyPageProps): JSX.Element => {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const handleDelete = async () => {
    const bountyID = router.query.id

    try {
      await fetch(`/api/bounties/${bountyID}`, {
        method: 'Delete',
      })
      router.push('/')
    } catch (error) {
      setMessage('Failed to delete the bounty.')
    }
  }

  return (
    <div key={bounty._id}>
      <div className="card">
        <img src={bounty.bountyImage} />
        <h5 className="bountyTitle">{bounty.bountyTitle}</h5>
        <div className="main-content">
          <p className="bountyTitle">{bounty.bountyTitle}</p>
          <p className="bountyCreatedBy">Created By: {bounty.createdBy}</p>

          {/* Extra Bounty Info: Reward and Guild */}
          <div className="bountyReward">
            <p className="label">Bounty Reward</p>
            <ul>{bounty.bountyReward}</ul>
          </div>
          <div className="bounty guild">
            <p className="label">Bounty Guild</p>
            <ul>{bounty.bountyGuild}</ul>
          </div>

          <div className="btn-container">
            <Link href="/[id]/edit" as={`/${bounty._id}/edit`}>
              <button className="btn edit">Edit</button>
            </Link>
            <button className="btn delete" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
      {message && <p>{message}</p>}
    </div>
  )
}

export async function getServerSideProps({ params }: { params: any }): Promise<{
  props: BountyPageProps
}> {
  await dbConnect()

  const bounty = await Bounty.findById(params.id).lean()
  bounty._id = bounty._id.toString()

  return { props: { bounty } }
}

export default BountyPage
