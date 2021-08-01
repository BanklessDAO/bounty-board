import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dbConnect from '../../utils/dbConnect'
import Bounty from '../../models/Bounty'

type BountyPageProps = {
  bounty: {
    _id: any
    season: any
    title: any
    description: any
    criteria: any
    reward: any
    createdBy: any
    createdAt: any
    status: any
    statusHistory: any
    bountyGuild: any
    bountyImage: any
  }
}

/*
_id
:
6104db20c229d1af5f149c4f
season
:
1
title
:
"stuff"
description
:
"asdfsda"
criteria
:
"asdfds"
reward
:
createdBy
:
discordHandle
:
"asdfdsf"
discordId
:
"234234"
createdAt
:
"2021-07-30"
statusHistory
:
status
:
"Draft"
dueAt
:
"2025-04-03"
*/

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
        <h5 className="bountyTitle">{bounty.title}</h5>
        <div className="main-content">
          <p className="bountyTitle">Bounty Name: {bounty.title}</p>
          <p className="bountySeason">Season: {bounty.season}</p>
          <p className="bountyCreatedBy">Created By: {bounty.createdBy.discordHandle}</p>
          <p className="bountyStatus">Status: {bounty.status}</p>

          {/* Extra Bounty Info: Reward and Guild */}
          <div className="bountyReward">
            <p className="label">Bounty Reward</p>
            <ul>
              <li>Amount: {bounty.reward.amount}</li>
              <li>Currency: {bounty.reward.currency}</li> 
              </ul>
          </div>
          <div className="bounty status history">
            <p className="label">Bounty Status History</p>
            <ul>
                {bounty.statusHistory.map((record: any) => (
                  <li>{record.status} {record.setAt} </li>
                ))}
              </ul>
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
