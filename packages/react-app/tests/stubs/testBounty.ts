import { InferInterface } from "../../src/types/Yup";
import yup, { InferType, TypeOf } from "yup";
import { BountyCollection, BountySchema } from "../../src/models/Bounty";

type T = InferInterface<typeof BountySchema>;


export const testBounty: T = {
  customer_id: "834499078434979890",
  season: 1,
  title: "TEST TITLE",
  description: "TEST DESCRIPTION",
  criteria: "TEST CRITERIA",
  editKey: "123",
  reward: {
    currency: "BANK",
    amount: 1000,
    scale: 2,
    amountWithoutScale: 10
  },
  createdBy: {
    discordHandle: "TESTHANDLE#1234",
    discordId: "324439902343239764"
  },
  createdAt: "2021-07-20T06:40:56.112Z",
  dueAt: "2021-07-20T06:42:28.853Z",
  claimedBy: {
    discordHandle: "rick#5555",
    discordId: "324423432343239764"
  },
  claimedAt: "2021-07-20T07:00:31.166Z",
  status: "Open",
  statusHistory: [
    {
      status: "Open",
      modifiedAt: "2021-07-20T07:00:31.166Z"
    },
    {
      status: "Draft",
      modifiedAt: "2021-07-20T07:00:31.166Z"
    },
    {
      status: "In-Progress",
      modifiedAt: "2021-07-20T07:00:31.166Z"
    },
    {
      status: "In-Review",
      modifiedAt: "2021-07-20T07:00:31.166Z"
    },
    {
      status: "Completed",
      modifiedAt: "2021-07-20T07:00:31.166Z"
    },
    {
      status: "Deleted",
      modifiedAt: "2021-07-20T07:00:31.166Z"
    }
  ]
}