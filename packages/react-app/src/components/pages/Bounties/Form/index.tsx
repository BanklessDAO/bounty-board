import { useState } from 'react'
import { useRouter } from 'next/router'
import { mutate } from 'swr'

const Form = ({
  formId,
  bountyForm,
  forNewBounty = true,
}: {
  formId: any
  bountyForm: any
  forNewBounty?: boolean
}): JSX.Element => {
  const router = useRouter()
  const contentType = 'application/json'
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    title: bountyForm.bountyTitle,
    season: bountyForm.bountySeason,
    description: bountyForm.bountyDescription,
    criteria: bountyForm.bountyCriteria,
    reward: bountyForm.bountyReward,
    createdBy: bountyForm.bountyCreatedBy,
    createdAt: bountyForm.bountyCreatedAt, //implict
    dueAt: bountyForm.dueAt, //implicit
    status: bountyForm.status, //implicit
  })

  /* The PUT method edits an existing entry in the mongodb database. */
  const putData = async (form: any) => {
    const { id } = router.query
    //When an edited bounty is submitted, its status becomes "open"
    form.status = 'open'

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
        throw new Error(`Error: ${res.status}`)
      }

      const { data } = await res.json()
      console.warn('PUT: ' + data.status)
      data.status = 'open'

      // Update the local data immediately without a revalidation
      mutate(`/api/bounties/${id}`, data, false)
      router.push('/')
    } catch (error) {
      setMessage('Failed to update bounty')
    }
  }

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (form: any) => {
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
        throw new Error(`Error: ${res.status}`)
      }

      router.push('/')
    } catch (error) {
      setMessage('Failed to add bounty')
    }
  }

  const handleChange = (e: any) => {
    const target = e.target
    const value = target.name === 'claimed' ? target.checked : target.value
    const name = target.name

    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const errs = formValidate({})
    if (Object.keys(errs).length === 0) {
      forNewBounty ? postData(form) : putData(form)
    } else {
      setErrors({ errs })
    }
  }

  /* Makes sure bounty info is filled for required bounty fields*/
  const formValidate = ({ err }: { err?: any }) => {
    if (!form.title) err.bountyTitle = 'Title is required'
    if (!form.season) err.bountySeason = 'Season is required'
    if (!form.description) err.bountyDescription = 'Description required'
    if (!form.criteria) err.bountyCriteria = 'Acceptance Criteria required'
    if (!form.reward) err.bountyReward = 'Bounty Reward required'
    if (!form.createdBy)
      err.bountyCreatedBy = 'Creator discord handle for bounty required'
    if (!form.createdAt)
      err.bountyCreatedAt = 'Bounty Created At required. Contact support'
    if (!form.dueAt)
      err.bountyDueAt = 'bounty expiration required. Contact support'
    if (!form.status)
      err.bountyStatus = 'bounty status required. Contact support'
    return err
  }

  return (
    <>
      <form id={formId} onSubmit={handleSubmit}>
        <label htmlFor="bountyTitle">Bounty Title</label>
        <input
          type="text"
          maxLength={40}
          name="bountyTitle"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="bountyDescription">Bounty Description</label>
        <textarea
          name="bountyDescription"
          maxLength={140}
          value={form.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="bountyCriteria">Bounty Criteria</label>
        <textarea
          maxLength={140}
          name="bountyCriteria"
          value={form.criteria}
          onChange={handleChange}
          required
        />

        <label htmlFor="bountyReward">Bounty Reward</label>
        <input
          type="number"
          name="bountyReward"
          value={form.reward}
          onChange={handleChange}
          required
        />

        <label htmlFor="bountyCreatedBy">Bounty Created By</label>
        <input
          type="text"
          maxLength={40}
          name="bountyCreatedBy"
          value={form.createdBy}
          onChange={handleChange}
        />

        {/*  Note createdAt, dueAt, and status are implicitly set in MVP 0.
           (i.e. not user specified) 
        */}

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
