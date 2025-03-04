import { MongoClient } from 'mongodb';

const uri = process.env['MONGO_URI'] || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export const getDb = (dbName: string) => {
  return client.db(dbName);
};
