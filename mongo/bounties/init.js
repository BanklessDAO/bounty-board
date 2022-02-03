conn = new Mongo();
db = conn.getDB("bountyboard");
db.bounties.createIndex({ title: 'text' });
printjson( db.bounties.createIndex({ title: 'text' }) );