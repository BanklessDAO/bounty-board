import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dbConnect from '../../utils/dbConnect'
import Bounty from '../../models/Bounty'

/* Allows you to view bounty card info and delete bounty card*/
const BountyPage = ({ bounty }) => {
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
        <img src={bounty.image_url} />
        <h5 className="bounty-name">{bounty.name}</h5>
        <div className="main-content">
          <p className="bounty-name">{bounty.name}</p>
          <p className="owner">Owner: {bounty.owner_name}</p>

          {/* Extra Bounty Info: Likes and Dislikes */}
          <div className="likes info">
            <p className="label">Likes</p>
            <ul>
              {bounty.likes.map((data, index) => (
                <li key={index}>{data} </li>
              ))}
            </ul>
          </div>
          <div className="dislikes info">
            <p className="label">Dislikes</p>
            <ul>
              {bounty.dislikes.map((data, index) => (
                <li key={index}>{data} </li>
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

export async function getServerSideProps({ params }) {
  await dbConnect()

  const bounty = await Bounty.findById(params.id).lean()
  bounty._id = bounty._id.toString()

  return { props: { bounty } }
}

export default PetPage
