db.createCollection("bountyCard", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "season",
        "bountyTitle",
        "bountyDescription",
        "bountyCriteria",
        "bountyReward",
        "bountyCreatedBy",
        "bountyCreatedAt",
        "bountyDueAt",
      ],
      properties: {
        season: {
          bsonType: "double",
          description: "must be a double and is required",
        },
        bountyTitle: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        bountyDescription: {
          bsonType: "string",
          description: "must be an string and is required",
        },
        bountyCriteria: {
          bsonType: "string",
          description: "must be an string and is required",
        },
        bountyReward: {
          bsonType: "object",
          description: "must be an object and is required",
          properties: {
            currency: {
              bsonType: "string",
              description: "must be a string and is required",
            },
            amount: {
              bsonType: "double",
              description: "must be a double and is required",
            },
          },
        },
        bountyCreatedBy: {
          bsonType: "objectId",
          description: "must be an objectId and is required",
        },
        bountyCreatedAt: {
          bsonType: "date",
          description: "must be a date and is required",
        },
        bountyDueAt: {
          bsonType: "date",
          description: "must be a date and is required",
        },
      },
    },
  },
});
