import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../utils/dbConnect'
import Bounty from '../../../models/Bounty'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const {
    query: { id },
    method,
  } = req

  await dbConnect()

  switch (method) {
    case 'GET' /* Get a model by its ID */:
      try {
        const bounty = await Bounty.findById(id)
        if (!bounty) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: bounty })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'PUT' /* Edit a model by its ID */:
      try {
        const bounty = await Bounty.findByIdAndUpdate(id, req.body, {
          runValidators: true,
        })
        if (!bounty) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: bounty })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'DELETE' /* Delete a model by its ID */:
      try {
        const deletedBounty = await Bounty.deleteOne({ _id: id })
        if (!deletedBounty) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: {} })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    default:
      res.status(400).json({ success: false })
      break
  }
}
