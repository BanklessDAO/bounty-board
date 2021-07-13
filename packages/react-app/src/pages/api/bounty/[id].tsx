import { NextApiRequest, NextApiResponse } from "next";

export default (request: NextApiRequest, response: NextApiResponse): void => {

    switch(request.method) {
        case 'GET':
            // Get the specific bounty
            break;
        case 'PUT':
            // Update the specific bounty
            break;
        default:
            response.setHeader('Allow', ['GET', 'PUT']);
            response.status(405).end(`Method ${request.method} Not Allowed`);
    }
}