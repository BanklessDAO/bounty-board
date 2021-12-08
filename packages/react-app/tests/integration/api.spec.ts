import dbConnect from "../../src/utils/dbConnect";
import Bounty from "../../src/models/Bounty";
import { Connection } from "mongoose";
import { createMocks } from 'node-mocks-http';
import bountiesHandler from "../../src/pages/api/bounties";
import bountyHandler from "../../src/pages/api/bounties/[id]";
import { NextApiRequest, NextApiResponse } from "next";
import { createBounty } from "services/bounty.service";

describe('Integration testing', () => {
  let connection: Connection;

  beforeAll(async () => {
    const connect = await dbConnect();
    connection = connect.connections[0];

    // load the test bounty
    await bountyService.createBounty({})
  })

  afterAll(async () => {
    await connection.close();
  })

  it('Correctly sets the DB', () => {
    const uri = process.env.MONGODB_URI;
    expect(uri).toEqual('mongodb://localhost:27017/test_bountyboard');
  });

  it('gets data from mongo', async () => {
    const bounties = await Bounty.find();
    expect(bounties.length).toEqual(6);
  });

  it('hits the api', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await bountiesHandler(req, res);
    const { data } = JSON.parse(res._getData())
    expect(data.length).toEqual(4);
  });

  it('Prevents string arrays', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'PUT',
      query: {
        id: ['0', '1']
      },
      body: {
        status: 'Unknown'
      },
    });

    await bountyHandler(req, res);
    expect(res.statusCode).toEqual(400);
  });

  it('Prevents string arrays', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'PUT',
      query: {
        id: ['0', '1']
      },
      body: {
        status: 'Unknown'
      },
    });

    await bountyHandler(req, res);
    expect(res.statusCode).toEqual(400);
  });  
})