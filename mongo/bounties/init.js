console.log('Attempting to connect to mongo...');

// Replaces `localhost` if running in a Docker container on network `mongo`
// for more info, see https://docs.docker.com/network/
conn = new Mongo('mongo:27017');

console.log('Connected to Mongo, fetching the DB...');

db = conn.getDB("bountyboard");

const idx = db.bounties.createIndex({
    "$**": 'text'
});

console.log(`Index ${idx} Created Successfully!`);
