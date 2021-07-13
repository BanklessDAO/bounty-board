import { useState } from 'react'
import { useRouter } from 'next/router'
import { mutate } from 'swr'

const Form = ({ formId, bountyForm, forNewBounty = true }) => {
  const router = useRouter()
  const contentType = 'application/json'
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    bountyTitle: bountyForm.bountyTitle,
    bountyDescription: bountyForm.bountyDescription,
    bountyCriteria: bountyForm.bountyCriteria,
    bountyReward: bountyForm.bountyReward,
    bountyGuild: bountyForm.bountyGuild,
    bountyCreatedBy: bountyForm.bountyCreatedBy,
    bountyExpiration: bountyForm.bountyExpiration,
    bountyImage: bountyForm.bountyImage,
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
    if (!form.bountyDescription) err.bountyDescription = 'Description required'
    if (!form.bountyCriteria) err.bountyCriteria = 'Acceptance Criteria required'
    if (!form.bountyReward) err.bountyReward = 'Bounty Reward required'
    if (!form.bountyGuild) err.bountyGuild = 'Guild is required'
    if (!form.bountyCreatedBy) err.bountyCreatedBy = 'Creator discord handle for bounty required'
    if (!form.bountyExpiration) err.bountyExpiration = 'bounty expiration required'
    if (!form.bountyImage) err.bountyImage = 'Image URL is required'
    return err
  }

  return (
    <>
      <form id={formId} onSubmit={handleSubmit}>
        <label htmlFor="bountyTitle">Bounty Title</label>
        <input
          type="text"
          maxLength="40"
          name="bountyTitle"
          value={form.bountyTitle}
          onChange={handleChange}
          required
        />

        <label htmlFor="bountyDescription">Bounty Description</label>
        <textarea
          name="bountyDescription"
          maxLength="140"
          value={form.bountyDescription}
          onChange={handleChange}
          required
        />

        <label htmlFor="bountyCriteria">Bounty Criteria</label>
        <textarea
          maxLength="140"
          name="bountyCriteria"
          value={form.bountyCriteria}
          onChange={handleChange}
          required
        />

        <label htmlFor="bountyReward">Bounty Reward</label>
        <input
          type="number"
          name="bountyReward"
          value={form.bountyReward}
          onChange={handleChange}
          required
        />

        <label htmlFor="bountyGuild">Bounty Guild</label>
        <input
          type="text"
          maxLength="30"
          name="bountyGuild"
          value={form.bountyGuild}
          onChange={handleChange}
        />

        <label htmlFor="bountyCreatedBy">Bounty Created By</label>
        <input
          type="text"
          maxLength="40"
          name="bountyCreatedBy"
          value={form.bountyCreatedBy}
          onChange={handleChange}
        />

        <label htmlFor="bountyExpiration">Bounty Expiration (days)</label>
        <input
          type="number"
          name="bountyExpiration"
          value={form.bountyExpiration}
          onChange={handleChange}
        />

        
        <label htmlFor="bountyImage"> Bounty Image URL </label>
        <input
          type="url"
          name="bountyImage"
          value={form.bountyImage}
          onChange={handleChange}
          required
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
