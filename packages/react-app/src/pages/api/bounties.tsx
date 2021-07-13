import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "src/utils/mongodb";

// Return a list of all available bounties
export default async (request: NextApiRequest, response: NextApiResponse): Promise<any> => {
    if (request.method !== 'GET') {
        response.setHeader('Allow', ['GET']);
        response.status(405).end(`Method ${request.method} Not Allowed`);
    }
    // Get the specific bounty
    const { db } = await connectToDatabase();
    const bounties = await db
        .collection('bounties')
        .find({})
        .toArray();
    response.json(bounties);
    return;
}