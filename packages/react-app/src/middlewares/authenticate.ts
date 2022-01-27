import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

type RouteFunction = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export const WHITELISTED_DISCORD_HANDLES = [
	// temporary api gating
	'jordaniza',
	'0xnshuman',
	'behold',
];

const isTest = process.env.TESTING === 'true';

const isRestrictedMethod = (req: NextApiRequest) => req.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
const authorized = (session: Session | null): boolean => Boolean(session && session.user && isWhitelisted(session.user.name));
const isWhitelisted = (name: string | null | undefined): boolean => WHITELISTED_DISCORD_HANDLES.includes((name ?? '').toLowerCase());

export default (handler: NextApiHandler): RouteFunction => {
	return async (req: NextApiRequest, res: NextApiResponse) => {
		if (!isTest && isRestrictedMethod(req)) {
			const session = await getSession({ req });
			if (authorized(session)) {
				await handler(req, res);
			} else {
				res.status(403).json({ success: false, error: 'This route is in preview mode and has restricted access, please sign in to access. If you want to be added, please contact the Bountyboard team.' });
			}
		} else {
			await handler(req, res);
		}
	};
};
