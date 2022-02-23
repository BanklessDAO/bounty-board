//CityDAO
db.customers.updateOne(
  {
    _id: ObjectId("616f00ae05026959ede9a3a5"),
    customer_id: "402910780124561410",
  },
  [
    {
      $set: {
        customization: {
          logo: "/citydao.png",
        },
      },
    },
  ]
);
