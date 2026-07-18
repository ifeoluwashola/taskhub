require('dotenv').config();
const { MongoClient } = require('mongodb');

async function run() {
  const mongoClient = process.env.MONGODB_CLIENT;
  const mongodbInitdbDatabase = process.env.MONGO_INITDB_DATABASE;
  
  const client = new MongoClient(mongoClient);
  await client.connect();
  const db = client.db(mongodbInitdbDatabase);
  const tasks = await db.collection('tasks').find().toArray();
  console.log(JSON.stringify(tasks, null, 2));
  await client.close();
}
run().catch(console.dir);
