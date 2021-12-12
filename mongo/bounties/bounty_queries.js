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

// How many Bounties were completed on time?
// compare these two queries:

db.bounties.find({ $expr: { $gt: ["submittedAt", "dueAt"] } }).count();
db.bounties.find({ $expr: { $gt: ["dueAt", "submittedAt"] } }).count();

// How many Bounties expired? (TBD; need to add new data fields to consider expiration)

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

// Bounties sorted by reward value Max
db.bounties.find().sort({ "reward.amount": -1 });

// Bounties sorted by reward value Min
db.bounties.find().sort({ "reward.amount": 1 });

// Bounties filtered by reward value at least X
db.bounties.find({ "reward.amount": { $gte: 3000 } });

// Bounties filtered by reward value up to X
db.bounties.find({ "reward.amount": { $lte: 2000 } });

// Bounties filtered by reward value between X & Y
db.bounties.find({ "reward.amount": { $gte: 2000, $lte: 3000 } });

// Bounties filtered twice - season and reward amount range (10-100), then listing all season, title and reward amount to meet criteria
db.bounties.find(
  { season: 2, "reward.amount": { $gt: 10, $lt: 100 } },
  { season: 1, title: 1, "reward.amount": 1, _id: 0 }
);

// MORE GENERAL HIGH LEVEL QUERIES

// Filter, then List the title of all Season 2 bounties
db.bounties.find({ season: 2 }, { season: 1, title: 1, _id: 0 });

// Filter, then List title and reward amount of all Season 2 bounties, sorted in descending order by amount
db.bounties
  .find({ season: 2 }, { title: 1, "reward.amount": 1 })
  .sort({ "reward.amount": -1 });

// Filter, then List title and reward amount of Season 2 bounties, for amounts > 99, sorted in descending order
db.bounties
  .find(
    { season: 2, "reward.amount": { $gt: 99 } },
    { title: 1, "reward.amount": 1 }
  )
  .sort({ "reward.amount": -1 });

// Filter for two conditions, then list season, title and reward amount
db.bounties.find(
  { season: 2, "reward.amount": { $lt: 20 } },
  { season: 1, title: 1, "reward.amount": 1, _id: 0 }
);

// Filter for two conditions, then list, season, title, reward amount, and sort in ascending order
db.bounties
  .find(
    { season: 2, "reward.amount": { $lt: 20 } },
    { season: 1, title: 1, "reward.amount": 1, _id: 0 }
  )
  .sort({ "reward.amount": 1 });

// Find all Season 2 bounties with the word "deploy" in the title
db.bounties.find({ season: 2, title: { $regex: "deploy" } });
db.bounties.find({ season: 2, title: /deploy/ });
db.bounties.find({ season: 2, title: { $regex: /deploy/i } });

// GUILD SPECIFIC QUERIES (need to add data fields)

// How many bounties were created by each Guild? (need to add new data field)
// Which Guild created the most bounties?
// How many bounties were submitted to each Guild?
// Which Guild received the most submitted bounties?
// How much bounty reward (in BANK) were given by each Guild?
// Which Guild gave the most reward?

// MULTI-TENANCY QUERIES

// Join bounties and customers collection
// only list bounty bounty title & customer name
db.bounties.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "customer_id",
      as: "customerName",
    },
  },
  {
    $unwind: "$customerName",
  },
  {
    $project: {
      _id: 0,
      title: 1,
      "customerName.customerName": 1,
    },
  },
]);
