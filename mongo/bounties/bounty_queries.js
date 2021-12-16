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

// GENERAL HIGH LEVEL QUERIES WITH SORTING

// Using Projection to shape results
db.bounties.find({}, { season: 1, title: 1, "reward.amount": 1, _id: 0 });

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

// COMPLEX QUERIES THROUGH AGGREGATION

// seasonal filter
// group by Bounty Creator, number of bounties per creator
// average reward posted
// sort by total bounties per person

db.bounties
  .aggregate([
    { $match: { season: 2 } },
    {
      $group: {
        _id: { creator_name: "$createdBy.discordHandle" },
        num_bounties_created: { $sum: 1 },
        avg_reward_amt: { $avg: "$reward.amount" },
      },
    },
    { $sort: { num_bounties_created: -1 } },
  ])
  .pretty();

// seasonal filter
// group by Currency, number of bounties per Currency,
// average reward posted
// sort by average reward posted, descending order

db.bounties
  .aggregate([
    { $match: { season: 2 } },
    {
      $group: {
        _id: { currency: "$reward.currency" },
        num_bounties_in_currency: { $sum: 1 },
        avg_reward_amt: { $avg: "$reward.amount" },
      },
    },
    { $sort: { avg_reward_amt: -1 } },
  ])
  .pretty();

// seasonal filter
// group by customer_id, number of bounties by customer,
// total rewards posted
// sort by total rewards posted, descending order

db.bounties
  .aggregate([
    { $match: { season: 1 } },
    {
      $group: {
        _id: { customer_id: "$customer_id" },
        num_bounties_per_customer: { $sum: 1 },
        total_reward_amt: { $sum: "$reward.amount" },
      },
    },
    { $sort: { total_reward_amt: -1 } },
  ])
  .pretty();

// seasonal filter
// group by submitter discordhandle, number of bounties per submitter,
// total rewards claimed
// sort by total rewards claimed, descending order

db.bounties
  .aggregate([
    { $match: { season: 1 } },
    {
      $group: {
        _id: { submitter_name: "$submittedBy.discordHandle" },
        num_submissions: { $sum: 1 },
        total_reward_claimed: { $sum: "$reward.amount" },
      },
    },
    { $sort: { total_reward_claimed: -1 } },
  ])
  .pretty();

//short cut to grouping by Bounty Creator
// can apply to Claimers and Submitters
db.bounties.aggregate([
  { $match: { season: 2 } },
  { $sortByCount: "$createdBy.discordHandle" },
]);

// seasonal filter
// group by bounty 'status', number of bounties per each status
// sort by number of bounties

db.bounties
  .aggregate([
    { $match: { season: 2 } },
    {
      $group: { _id: { bounty_status: "$status" }, num_bounties: { $sum: 1 } },
    },
    { $sort: { num_bounties: -1 } },
  ])
  .pretty();

// short cut to do grouping by status
db.bounties.aggregate([{ $match: { season: 2 } }, { $sortByCount: "$status" }]);

// seasonal filter
// sort by createdAt date, starting with most recent
// project/display only title and createdAt date
// note: can use '$toDate' instead of '$convert, input, to'

db.bounties
  .aggregate([
    { $match: { season: 2 } },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        _id: 0,
        title: 1,
        createdAt: { $convert: { input: "$createdAt", to: "date" } },
      },
    },
  ])
  .pretty();

// seasonal filter
// display avg_reward bountied per week
// group by week
// sort by week, by week in descending order
db.bounties.aggregate([
  { $match: { season: 1 } },
  {
    $project: {
      _id: 0,
      season: 1,
      "reward.amount": 1,
      createdAt: { $toDate: "$createdAt" },
    },
  },
  {
    $group: {
      _id: { week: { $isoWeek: "$createdAt" } },
      avg_reward: { $avg: "$reward.amount" },
    },
  },
  { $sort: { week: -1 } },
]);

// seasonal filter
// display total rewards bountied per week
// group by week
// sort by week, by week in descending order
db.bounties.aggregate([
  { $match: { season: 1 } },
  {
    $project: {
      _id: 0,
      season: 1,
      "reward.amount": 1,
      createdAt: { $toDate: "$createdAt" },
    },
  },
  {
    $group: {
      _id: { week: { $isoWeek: "$createdAt" } },
      total_reward: { $sum: "$reward.amount" },
    },
  },
  { $sort: { week: -1 } },
]);

// DISPLAY ($project) SPECIFIC FIELDS

// display subset of fields in bounties
// then, sort by reward amount
db.bounties.aggregate([
  {
    $project: {
      _id: 0,
      season: 1,
      title: 1,
      "reward.amount": 1,
      "reward.currency": 1,
    },
  },
  { $sort: { "reward.amount": -1 } },
]);

// group bounty by Season,
// average reward committed
db.bounties.aggregate([
  { $project: { _id: 0, season: 1, "reward.amount": 1 } },
  {
    $group: {
      _id: { bounty_season: "$season" },
      avg_reward: { $avg: "$reward.amount" },
    },
  },
]);

// seasonal comparison for BanklessDAO
// group by Season
// number of bounties created

db.bounties.aggregate([
  { $match: { customer_id: "834499078434979890" } },
  { $project: { _id: 1, title: 1, season: 1 } },
  {
    $group: {
      _id: { bounty_season: "$season" },
      number_of_bounties: { $sum: 1 },
    },
  },
]);

// GETTING NUMBER OF BOUNTIES PAST 7-days

// type in shell to get date from 7-days ago
var d = new Date();
d.setDate(d.getDate() - 7);

db.bounties
  .aggregate([
    { $match: { season: 2 } },
    { $project: { _id: 1, title: 1, createdAt: { $toDate: "$createdAt" } } },
    { $match: { createdAt: { $gt: d } } },
    { $unwind: "$createdAt" },
    { $match: { createdAt: { $gt: d } } },
  ])
  .pretty();
