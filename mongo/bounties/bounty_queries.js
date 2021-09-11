// GENERAL HIGH LEVEL QUERIES

// How many Bounties were created in Season 1?

db.bounties.find({ season: 1 }).count();

// How much BANK was allocated for Bounties in Season 1? (TBD: aggregation framework)

db.bounties
  .aggregate([
    { $match: { season: 1 } },
    {
      $group: {
        _id: { reward: "$reward.currency" },
        total: { $sum: "$reward.amount" },
      },
    },
  ])
  .pretty();

// (sort amount of BANK allocated in Season 1 in Descending order)

db.bounties.find({ season: 1 }).sort({ "reward.amount": -1 });

// Number of Bounties at the start of the season? vs end of season? (TBD)

// (sort bounties by createdAt, descending)

db.bounties.find({ season: 1 }).sort({ createdAt: -1 });

// Who created the most bounties?

db.bounties
  .aggregate([
    { $match: { season: 1 } },
    {
      $group: {
        _id: { createdBy: "$createdBy.discordHandle" },
        totalAmount: { $sum: 1 },
      },
    },
    { $sort: { totalAmount: -1 } },
  ])
  .pretty();

// Who claimed the most bounties?

db.bounties
  .aggregate([
    { $match: { season: 1 } },
    {
      $group: {
        _id: { claimedBy: "$claimedBy.discordHandle" },
        totalAmount: { $sum: 1 },
      },
    },
    { $sort: { totalAmount: -1 } },
  ])
  .pretty();

// (display claimedBy.discordHandle to eyeball)

db.bounties.find({}, { "claimedBy.discordHandle": 1 }).pretty();

// Who completed/submitted the most bounties?

db.bounties
  .aggregate([
    { $match: { season: 1 } },
    {
      $group: {
        _id: { submittedBy: "$submittedBy.discordHandle" },
        totalAmount: { $sum: 1 },
      },
    },
    { $sort: { totalAmount: -1 } },
  ])
  .pretty();

// (display submittedBy.discordHandle to eyeball)

db.bounties.find({}, { "submittedBy.discordHandle": 1 }).pretty();

// Which guild completed the most bounties? (TBD, need to add new data fields to answer this question)

// BOUNTY STATUS QUERIES

// How many Bounties were completed on time? (need to add new data fields to consider timeliness)

// How many Bounties expired? (need to add new data fields to consider expiration)

// How many Bounties were expired? (past tense)

db.bounties.find({ "statusHistory.status": "Deleted" }).count();

// How many Bounties current status is 'deleted'?

db.bounties.find({ status: "Deleted" }).count();

// How many Bounties are (currently) open?

db.bounties.find({ status: "Open" }).count();

// How many Bounties were drafted? (might not be meaningful as 'draft' turns into 'open')

db.bounties.find({ "statusHistory.status": "Draft" }).count();

// How many Bounties are (currently) in 'Draft'?

db.bounties.find({ status: "Draft" }).count();

// How many Bounties are (currently) 'In-Progress'?

db.bounties.find({ status: "In-Progress" }).count();

// How many Bounties were 'In-Progress' at one point in time?

db.bounties.find({ "statusHistory.status": "In-Progress" }).count();

// How many Bounties were 'In-Review' at one point in time?

db.bounties.find({ "statusHistory.status": "In-Review" }).count();

// How many Bounties are (currently) 'In-Review'?

db.bounties.find({ status: "In-Review" }).count();
