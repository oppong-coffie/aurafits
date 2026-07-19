const mongoose = require('mongoose');

const uri = 'mongodb://pinkyshop434_db_user:aofuRgUAOKRDNQOK@ac-sufm30n-shard-00-00.pqstvwh.mongodb.net:27017,ac-sufm30n-shard-00-01.pqstvwh.mongodb.net:27017,ac-sufm30n-shard-00-02.pqstvwh.mongodb.net:27017/pinkyshop?ssl=true&replicaSet=atlas-6fwnmx-shard-0&authSource=admin';

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected successfully!');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    const products = await db.collection('products').find().toArray();
    console.log('Found products:', products.length);
    for (const p of products) {
      console.log(`- ${p.name} (${p.category}): Price GHS ${p.price}, Status: ${p.status}, Sizes: ${p.sizes?.join(', ')}, Colors: ${p.colors?.join(', ')}`);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
