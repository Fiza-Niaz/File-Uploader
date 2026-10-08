const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let bucket;

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  bucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads',
  });
  console.log('MongoDB connected');
}

function getBucket() {
  if (!bucket) {
    throw new Error('GridFS is not initialized. Connect to MongoDB first.');
  }
  return bucket;
}

module.exports = { connectDB, getBucket };