db.createCollection("bounties", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "season",
        "title",
        "description",
        "criteria",
        "reward",
        "createdBy",
        "createdAt",
        "dueAt",
      ],
      properties: {
        season: {
          bsonType: "int",
          description: "the current season of the DAO, nonzero integer, /^[0,9]+$/",
        },
        title: {
          bsonType: "string",
          description: "a short title about the bounty, /^[\\w\\s.!@#$%&,?']{1,50}$/",
        },
        description: {
          bsonType: "string",
          description: "a short description of the bounty, /^[\\w\\s.!@#$%&,?']{1,250}$/",
        },
        criteria: {
          bsonType: "string",
          description: "absolutely required work for bounty to be Completed, /^[\\w\\s.!@#$%&,?']{1,250}$/",
        },
        reward: {
          bsonType: "object",
          description: "how much to be distributed to worker once bounty is Completed",
          required: ["currency", "amount"],
          properties: {
            currency: {
              bsonType: "string",
              description: "the currency denomination i.e ETH",
            },
            amount: {
              bsonType: "double",
              description: "the amount to be rewarded i.e 1000",
            },
          },
        },
        createdBy: {
          bsonType: "object",
          description: "user object who created the bounty",
          required: ["discordHandle", "discordId"],
          properties: {
            discordHandle: {
              bsonType: "string",
              description: "the discord tag i.e hydrabolt#0001",
            },
            discordId: {
              bsonType: "string",
              description: "the discord internal id, i.e 324439906234239764",
            }
          }
        },
        createdAt: {
          bsonType: "string",
          description: "ISO8601 date string for when the bounty was created",
        },
        dueAt: {
          bsonType: "string",
          description: "ISO8601 date string for when the bounty is due (default to end of season)",
        },
      },
    },
  },
});
