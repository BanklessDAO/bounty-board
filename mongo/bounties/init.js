db.createCollection('bounties');
db.bounties.createIndex({ title: 'text' });
