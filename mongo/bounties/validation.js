db.createCollection("bountyCard", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "season",
        "Title",
        "Description",
        "Criteria",
        "Reward",
        "CreatedBy",
        "CreatedAt",
        "DueAt",
      ],
      properties: {
        season: {
          bsonType: "double",
          description: "must be a double and is required",
        },
        Title: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        Description: {
          bsonType: "string",
          description: "must be an string and is required",
        },
        Criteria: {
          bsonType: "string",
          description: "must be an string and is required",
        },
        Reward: {
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
        CreatedBy: {
          bsonType: "objectId",
          description: "must be an objectId and is required",
        },
        CreatedAt: {
          bsonType: "date",
          description: "must be a date and is required",
        },
        DueAt: {
          bsonType: "date",
          description: "must be a date and is required",
        },
      },
    },
  },
});
