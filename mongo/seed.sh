#!/bin/sh

localDb="bountyboard"
testDb="test_bountyboard"

load_bounties () {
    mongoimport\
        --host mongo\
        --db $1\
        --collection bounties\
        --drop\
        --file usr/tmp/mongo/bounties/bboard_v4.json\
        --jsonArray
}

load_customers () {
    mongoimport\
        --host mongo\
        --db $1\
        --collection customers\
        --drop\
        --file usr/tmp/mongo/customers/seed_customers.json\
        --jsonArray
}

echo "Seeding the local Mongo Database with bounties..."
load_bounties $localDb

echo "Adding Text Index to bounties..."
mongosh --host mongo usr/tmp/mongo/bounties/init.js

echo "Adding Customers..."
load_customers $localDb

# echo "Seeding the test Mongo Database with bounties..."
# load_bounties $testDb

# echo "Adding test Customers..."
# load_customers $testDb
