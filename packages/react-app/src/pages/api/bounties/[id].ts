import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Bounty, { BountyCollection, BountySchema } from '../../../models/Bounty';
import DiscordUtils from '../../../utils/DiscordUtils';
import validate from 'middlewares/validate';
import { notFound } from 'errors';

const BOUNTY_BOARD_WEBHOOK_URI = process.env.DISCORD_BOUNTY_BOARD_WEBHOOK || '';

const getBounty = async (id: string): Promise<BountyCollection | null> => {
	/**
	 * @param id is a 24 character string, try to find it in the db
	 * If the character !== 24 chars, or we can't find the bounty, return null 
	 */
	return id.length === 24 ? await Bounty.findById(id) : null;
};

const editBounty = async (bounty: BountyCollection, body: Record<string, unknown>): Promise<BountyCollection | null> => {
	const bountyEditable = ['draft', 'open'].includes(bounty.status.toLowerCase());
	if (bountyEditable) {
		const updatedBounty = await Bounty.findByIdAndUpdate(bounty._id, body, {
			new: true,
			omitUndefined: true,
			runValidators: true,
		}) as BountyCollection
		await publishBountyToDiscordChannel(updatedBounty, updatedBounty.status);
		return updatedBounty
	}
	return null
}

const deleteBounty = async (id: string) => {
	await Bounty.findByIdAndDelete(id)
}


export const publishBountyToDiscordChannel = async (
	bounty: BountyCollection,
	previousStatus: string
): Promise<any> => {
	if (previousStatus.toLowerCase() !== 'draft') {
		return;
	}
	const embedMessage = DiscordUtils.generateBountyEmbedsMessage(bounty);
	return await fetch(BOUNTY_BOARD_WEBHOOK_URI + '?wait=true', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(embedMessage),
	})
		.then((response) => {
			if (response.status !== 200) console.log(response);
		})
		.catch(console.error);
};


const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	const {
		query: { id, key },
		method,
	} = req;
	
	if (typeof id !== 'string') {
		res.status(400).json({
			success: false,
			message: 'Pass a single bounty id in the request'
		})
	};

	await dbConnect();

	switch (method) {
	case 'GET':
		/* Get a model by its ID */
		try {
			const bounty = await getBounty(id as string);
			if (!bounty) {
				return notFound(res);
			}
			res.status(200).json({ success: true, data: bounty });
		} catch (error) {
			res.status(400).json({ success: false, error });
		}
		break;

	case 'PUT' :
		/* Edit a model by its ID */
		try {
				const bounty = await getBounty(id as string);
				if (!bounty) {
					return notFound(res);
				}
				const updateBounty = await editBounty(bounty, req.body);
				if (!updateBounty) {
					res.status(400).json({ success: false });
				}
				res.status(200).json({ success: true, data: updateBounty });
			} catch (error) {
				res.status(400).json({ success: false, error });
			}
		break;

	case 'DELETE':
		try {
			const bounty = await getBounty(id as string);
			if (!bounty) {
				return notFound(res);
			}
			await deleteBounty(id as string);
			res.status(204).json({ success: true, message: 'Bounty deleted' })
		} catch (error) {
			res.status(400).json({ success: false, error });
		}

	default:
		res.status(500).json({ success: false, error: 'Internal Server Error' });
		break;
	}
}

export default validate({ schema: BountySchema, handler });
