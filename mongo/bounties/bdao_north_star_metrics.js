// Note These metrics correspond to the aggregations used in Mongo Charts displayed at team standups

//------------ NORTH STAR METRICS ---------------

// ---------- Daily Active Users-----------------
// by User Actions (create, claim, submit, review)
// NOTE Change createdAt -> claimedAt -> submittedAt -> reviewedAt

// Example Bounties Created
db.bounties.aggregate([
  { $match: { customerId: "834499078434979890" } },
  {
    $project: {
      _id: 1,
      _customerId: "$customerId",
      _title: "$title",
      _status: "$status",
      _createdAt: "$createdAt",
      _claimedAt: "$claimedAt",
      _submittedAt: "$submittedAt",
      _reviewedAt: "$reviewedAt",
    },
  },
  {
    $project: {
      _id: 1,
      customerId: "$_customerId",
      title: "$_title",
      status: "$_status",
      createdAt: { $toDate: "$_createdAt" },
      claimedAt: { $toDate: "$_claimedAt" },
      submittedAt: { $toDate: "$_submittedAt" },
      reviewedAt: { $toDate: "$_reviewedAt" },
    },
  },
  {
    $match: {
      createdAt: { $gt: new Date(new Date() - 1 * 60 * 60 * 24 * 1000) },
    },
  },
]);

// Example Bounties Claimed
db.bounties.aggregate([
  { $match: { customerId: "834499078434979890" } },
  {
    $project: {
      _id: 1,
      _customerId: "$customerId",
      _title: "$title",
      _status: "$status",
      _createdAt: "$createdAt",
      _claimedAt: "$claimedAt",
      _submittedAt: "$submittedAt",
      _reviewedAt: "$reviewedAt",
    },
  },
  {
    $project: {
      _id: 1,
      customerId: "$_customerId",
      title: "$_title",
      status: "$_status",
      createdAt: { $toDate: "$_createdAt" },
      claimedAt: { $toDate: "$_claimedAt" },
      submittedAt: { $toDate: "$_submittedAt" },
      reviewedAt: { $toDate: "$_reviewedAt" },
    },
  },
  {
    $match: {
      claimedAt: { $gt: new Date(new Date() - 1 * 60 * 60 * 24 * 1000) },
    },
  },
]);

// ---------- Weekly Active Users-----------------
// by User Actions (create, claim, submit, review)
// NOTE Change createdAt -> claimedAt -> submittedAt -> reviewedAt

// Example Bounties Submitted
db.bounties.aggregate([
  { $match: { customerId: "834499078434979890" } },
  {
    $project: {
      _id: 1,
      _customerId: "$customerId",
      _title: "$title",
      _status: "$status",
      _createdAt: "$createdAt",
      _claimedAt: "$claimedAt",
      _submittedAt: "$submittedAt",
      _reviewedAt: "$reviewedAt",
    },
  },
  {
    $project: {
      _id: 1,
      customerId: "$_customerId",
      title: "$_title",
      status: "$_status",
      createdAt: { $toDate: "$_createdAt" },
      claimedAt: { $toDate: "$_claimedAt" },
      submittedAt: { $toDate: "$_submittedAt" },
      reviewedAt: { $toDate: "$_reviewedAt" },
    },
  },
  {
    $match: {
      submittedAt: { $gt: new Date(new Date() - 7 * 60 * 60 * 24 * 1000) },
    },
  },
]);

// Example Bounties Reviewed
db.bounties.aggregate([
  { $match: { customerId: "834499078434979890" } },
  {
    $project: {
      _id: 1,
      _customerId: "$customerId",
      _title: "$title",
      _status: "$status",
      _createdAt: "$createdAt",
      _claimedAt: "$claimedAt",
      _submittedAt: "$submittedAt",
      _reviewedAt: "$reviewedAt",
    },
  },
  {
    $project: {
      _id: 1,
      customerId: "$_customerId",
      title: "$_title",
      status: "$_status",
      createdAt: { $toDate: "$_createdAt" },
      claimedAt: { $toDate: "$_claimedAt" },
      submittedAt: { $toDate: "$_submittedAt" },
      reviewedAt: { $toDate: "$_reviewedAt" },
    },
  },
  {
    $match: {
      reviewedAt: { $gt: new Date(new Date() - 7 * 60 * 60 * 24 * 1000) },
    },
  },
]);

// ---------- Monthly Active Users-----------------
// by User Actions (create, claim, submit, review)
// NOTE Change createdAt -> claimedAt -> submittedAt -> reviewedAt

// Example Bounties Created
db.bounties.aggregate([
  { $match: { customerId: "834499078434979890" } },
  {
    $project: {
      _id: 1,
      _customerId: "$customerId",
      _title: "$title",
      _status: "$status",
      _createdAt: "$createdAt",
      _claimedAt: "$claimedAt",
      _submittedAt: "$submittedAt",
      _reviewedAt: "$reviewedAt",
    },
  },
  {
    $project: {
      _id: 1,
      customerId: "$_customerId",
      title: "$_title",
      status: "$_status",
      createdAt: { $toDate: "$_createdAt" },
      claimedAt: { $toDate: "$_claimedAt" },
      submittedAt: { $toDate: "$_submittedAt" },
      reviewedAt: { $toDate: "$_reviewedAt" },
    },
  },
  {
    $match: {
      createdAt: { $gt: new Date(new Date() - 30 * 60 * 60 * 24 * 1000) },
    },
  },
]);

// ---------- UNIQUE USERS ------------

// -----------Unique Weekly Active Users (over past 30-days) ------------
// by User Actions (create, claim, submit, review)
// NOTE Change $isoWeek createdAt -> claimedAt -> submittedAt -> reviewedAt

// Example Number of Unique Creators (by week, past 30-days)
db.bounties.aggregate([
  { $match: { customerId: "834499078434979890" } },
  {
    $project: {
      _id: 1,
      _customerId: "$customerId",
      _title: "$title",
      _status: "$status",
      _createdAt: "$createdAt",
      "createdBy.discordHandle": 1,
    },
  },
  {
    $project: {
      _id: 1,
      customerId: "$_customerId",
      title: "$_title",
      status: "$_status",
      createdAt: { $toDate: "$_createdAt" },
      "createdBy.discordHandle": 1,
    },
  },
  {
    $match: {
      createdAt: { $gt: new Date(new Date() - 30 * 60 * 60 * 24 * 1000) },
    },
  },
  {
    $group: {
      _id: { week: { $isoWeek: "$createdAt" } },
      num_creators: { $sum: 1 },
      unique_creators: { $addToSet: "$createdBy.discordHandle" },
    },
  },
]);

// Example Number of Unique Reviewers (by week, past 30-days)
db.bounties.aggregate([
  { $match: { customerId: "834499078434979890" } },
  {
    $project: {
      _id: 1,
      _customerId: "$customerId",
      _title: "$title",
      _status: "$status",
      _reviewedAt: "$reviewedAt",
      "reviewedBy.discordHandle": 1,
    },
  },
  {
    $project: {
      _id: 1,
      customerId: "$_customerId",
      title: "$_title",
      status: "$_status",
      reviewedAt: { $toDate: "$_reviewedAt" },
      "reviewedBy.discordHandle": 1,
    },
  },
  {
    $match: {
      reviewedAt: { $gt: new Date(new Date() - 30 * 60 * 60 * 24 * 1000) },
    },
  },
  {
    $group: {
      _id: { week: { $isoWeek: "$reviewedAt" } },
      num_reviewers: { $sum: 1 },
      unique_reviewers: { $addToSet: "$reviewedBy.discordHandle" },
    },
  },
]);

// -----------Unique Weekly Active Users (since Jan 1st 2022) ------------
// by User Actions (create, claim, submit, review)
// NOTE Change $isoWeek createdAt -> claimedAt -> submittedAt -> reviewedAt

// Example Number of Unique Claimers (since Jan 1st 2022)
db.bounties.aggregate([
  {
    $match: {
      $and: [
        { customerId: "834499078434979890" },
        { claimedAt: { $gte: "2022-01-01" } },
      ],
    },
  },
  {
    $project: {
      _id: 1,
      claimedAt: { $toDate: "$claimedAt" },
      "claimedBy.discordHandle": 1,
    },
  },
  {
    $group: {
      _id: { week: { $isoWeek: "$claimedAt" } },
      unique_claimers: { $addToSet: "$claimedBy.discordHandle" },
    },
  },
]);

// Example Number of Unique Submitters (since Jan 1st 2022)
db.bounties.aggregate([
  {
    $match: {
      $and: [
        { customerId: "834499078434979890" },
        { submittedAt: { $gte: "2022-01-01" } },
      ],
    },
  },
  {
    $project: {
      _id: 1,
      submittedAt: { $toDate: "$submittedAt" },
      "submittedBy.discordHandle": 1,
    },
  },
  {
    $group: {
      _id: { week: { $isoWeek: "$submittedAt" } },
      unique_submitters: { $addToSet: "$submittedBy.discordHandle" },
    },
  },
]);

// ---------------- Percentage of Bounties Created (since Jan 1st 2022) --------------

// Percentage % Bounties Created since Jan 1st, 2022
db.bounties.aggregate([
  { $match: { customerId: "834499078434979890" } },
  {
    $group: {
      _id: 1,
      count_new: {
        $sum: { $cond: [{ $gte: ["$createdAt", "2022-01-01"] }, 1, 0] },
      },
      count_repeat: {
        $sum: { $cond: [{ $lt: ["$createdAt", "2022-01-01"] }, 1, 0] },
      },
    },
  },
  {
    $project: {
      _id: 1,
      new_creator_percentage: { $divide: ["$count_new", "$count_repeat"] },
    },
  },
]);

// Percentage % Bounties Created since Feb 1st, 2022
db.bounties.aggregate([
  { $match: { customerId: "834499078434979890" } },
  {
    $group: {
      _id: 1,
      count_new: {
        $sum: { $cond: [{ $gte: ["$createdAt", "2022-02-01"] }, 1, 0] },
      },
      count_repeat: {
        $sum: { $cond: [{ $lt: ["$createdAt", "2022-02-01"] }, 1, 0] },
      },
    },
  },
  {
    $project: {
      _id: 1,
      new_creator_percentage: { $divide: ["$count_new", "$count_repeat"] },
    },
  },
]);
