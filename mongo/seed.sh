#!/bin/sh
echo "Seeding the test Mongo Database with bounties..."
mongoimport\
    --host mongo\
    --db bountyboard\
    --collection bounties\
    --drop\
    --file usr/tmp/mongo/bounties/bboard_v4.json\
    --jsonArray

echo "Adding Text Index to bounties..."
mongosh --host mongo usr/tmp/mongo/bounties/init.js

echo "Adding Customers..."
mongoimport\
    --host mongo\
    --db bountyboard\
    --collection customers\
    --drop\
    --file usr/tmp/mongo/customers/seed_customers.json\
    --jsonArray
