#!/bin/sh
echo "Seeding the test Mongo Database..."
mongoimport\
    --db bountyboard\
    --collection bounties\
    --drop\
    --file usr/tmp/mongo/bounties/bboard_final3.json\
    --jsonArray

# echo "Applying Javascript Queries"

# mongosh usr/tmp/mongo/bounties/validation_final2.js
# mongosh usr/tmp/mongo/bounties/applyObjectId.js