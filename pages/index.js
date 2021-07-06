import Link from 'next/link'
import dbConnect from '../utils/dbConnect'
import Bounty from '../models/Bounty'

const Index = ({ bounties }) => (
  <>
    {/* Create a card for each bounty */}
    {bounties.map((bounty) => (
      <div key={bounty._id}>
        <div className="card">
          <img src={bounty.image_url} />
          <h5 className="bounty-name">{bounty.name}</h5>
          <div className="main-content">
            <p className="bounty-name">{bounty.name}</p>
            <p className="owner">Owner: {bounty.owner_name}</p>

            {/* Extra bounty Info: Likes and Dislikes */}
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
              <Link href="/[id]" as={`/${bounty._id}`}>
                <button className="btn view">View</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    ))}
  </>
)

/* Retrieves bounty(s) data from mongodb database */
export async function getServerSideProps() {
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
