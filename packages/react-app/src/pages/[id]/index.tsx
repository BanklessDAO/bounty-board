import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dbConnect from '../../utils/dbConnect'
import Bounty from '../../models/Bounty'
import { BountyBoardProps } from '../../models/Bounty'

/* Allows you to view bounty card info and delete bounty card*/
const BountyPage = ({
  _id,
  status,
  title,
  season,
  createdBy,
  reward,
  statusHistory,
}: BountyBoardProps): JSX.Element => {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const handleDelete = async () => {
    if (status.match(/^draft/i)) {
      return <p>Bounty is no longer a draft. Unauthorized to delete.</p>
    }
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
    <div key={_id}>
      <div className="card">
        <h5 className="bountyTitle">{title}</h5>
        <div className="main-content">
          <p className="bountyTitle">Bounty Name: {title}</p>
          <p className="bountySeason">Season: {season}</p>
          <p className="bountyCreatedBy">
            Created By: {createdBy.discordHandle}
          </p>
          <p className="bountyStatus">Status: {status}</p>

          {/* Extra Bounty Info: Reward and Guild */}
          <div className="bountyReward">
            <p className="label">Bounty Reward</p>
            <ul>
              <li>Amount: {reward.amount}</li>
              <li>Currency: {reward.currency}</li>
            </ul>
          </div>
          <div className="bounty status history">
            <p className="label">Bounty Status History</p>
            <ul>
              {statusHistory &&
                statusHistory.map((record: any) => (
                  <li key={record.setAt}>
                    {record.status} {record.setAt}{' '}
                  </li>
                ))}
            </ul>
          </div>

          <div className="btn-container">
            <Link href="/[id]/edit" as={`/${_id}/edit`}>
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
  props: BountyBoardProps
}> {
  await dbConnect()

  const bounty = await Bounty.findById(params.id).lean()
  bounty._id = bounty._id.toString()

  return { props: bounty }
}

export default BountyPage
