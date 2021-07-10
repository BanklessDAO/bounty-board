import { useState } from 'react'
import { useRouter } from 'next/router'
import { mutate } from 'swr'

// User entered form fields:
// bountyTitle
// bountyDescription
// bountyCriteria
// bountyReward
// bountyGuild
// bountyCreatedDiscord
// bountyCreatedAt
// bountyExpiration
// bountySkills
// bountyImage

const Form = ({ formId, bountyForm, forNewBounty = true }) => {
  const router = useRouter()
  const contentType = 'application/json'
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    bountyTitle: bountyForm.bountyTitle,
    owner_name: bountyForm.owner_name,
    guild: bountyForm.guild,
    reward: bountyForm.reward,
    claimed: bountyForm.claimed,
    claimedBy: bountyForm.claimedBy,
    image_url: bountyForm.image_url,
    likes: bountyForm.likes,
    dislikes: bountyForm.dislikes,
  })

  /* The PUT method edits an existing entry in the mongodb database. */
  const putData = async (form) => {
    const { id } = router.query

    try {
      const res = await fetch(`/api/bounties/${id}`, {
        method: 'PUT',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(form),
      })

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status)
      }

      const { data } = await res.json()

      mutate(`/api/bounties/${id}`, data, false) // Update the local data without a revalidation
      router.push('/')
    } catch (error) {
      setMessage('Failed to update bounty')
    }
  }

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (form) => {
    try {
      const res = await fetch('/api/bounties', {
        method: 'POST',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(form),
      })

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status)
      }

      router.push('/')
    } catch (error) {
      setMessage('Failed to add bounty')
    }
  }

  const handleChange = (e) => {
    const target = e.target
    const value =
      target.name === 'claimed' ? target.checked : target.value
    const name = target.name

    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = formValidate()
    if (Object.keys(errs).length === 0) {
      forNewBounty ? postData(form) : putData(form)
    } else {
      setErrors({ errs })
    }
  }

  /* Makes sure bounty info is filled for bounty name, owner name, guild, and image url*/
  const formValidate = () => {
    let err = {}
    if (!form.bountyTitle) err.bountyTitle = 'Title is required'
    if (!form.owner_name) err.owner_name = 'Owner is required'
    if (!form.guild) err.guild = 'Guild is required'
    if (!form.image_url) err.image_url = 'Image URL is required'
    return err
  }

  return (
    <>
      <form id={formId} onSubmit={handleSubmit}>
        <label htmlFor="bountyTitle">Title</label>
        <input
          type="text"
          maxLength="20"
          name="bountyTitle"
          value={form.bountyTitle}
          onChange={handleChange}
          required
        />

        <label htmlFor="owner_name">Owner</label>
        <input
          type="text"
          maxLength="20"
          name="owner_name"
          value={form.owner_name}
          onChange={handleChange}
          required
        />

        <label htmlFor="guild">Guild</label>
        <input
          type="text"
          maxLength="30"
          name="guild"
          value={form.guild}
          onChange={handleChange}
          required
        />

        <label htmlFor="reward">Reward</label>
        <input
          type="number"
          name="reward"
          value={form.reward}
          onChange={handleChange}
        />

        <label htmlFor="claimed">Claimed</label>
        <input
          type="checkbox"
          name="claimed"
          checked={form.claimed}
          onChange={handleChange}
        />

        <label htmlFor="claimedBy">Claimed By</label>
        <textarea
          name="claimedBy"
          maxLength="40"
          value={form.claimedBy}
          onChange={handleChange}
        />

        <label htmlFor="image_url">Image URL</label>
        <input
          type="url"
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          required
        />

        <label htmlFor="likes">Likes</label>
        <textarea
          name="likes"
          maxLength="60"
          value={form.likes}
          onChange={handleChange}
        />

        <label htmlFor="dislikes">Dislikes</label>
        <textarea
          name="dislikes"
          maxLength="60"
          value={form.dislikes}
          onChange={handleChange}
        />

        <button type="submit" className="btn">
          Submit
        </button>
      </form>
      <p>{message}</p>
      <div>
        {Object.keys(errors).map((err, index) => (
          <li key={index}>{err}</li>
        ))}
      </div>
    </>
  )
}

export default Form
