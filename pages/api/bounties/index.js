import dbConnect from '../../../utils/dbConnect'
import Bounty from '../../../models/Bounty'

export default async function handler(req, res) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const bounties = await Bounty.find({}) /* find all the data in our database */
        res.status(200).json({ success: true, data: bounties })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'POST':
      try {
        const bounty = await Bounty.create(
          req.body
        ) /* create a new model in the database */
        res.status(201).json({ success: true, data: bounty })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
