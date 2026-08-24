const mongoose = require('mongoose');
const dns = require('dns');
const env = require('./env');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignore if custom DNS cannot be set
}

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    let uri = env.MONGODB_URI;

    if (!uri) {
      console.log('⚡ No MONGODB_URI provided. Starting in-memory MongoDB Server fallback (this may take a few seconds on first run)...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoMemoryServer = await MongoMemoryServer.create();
        uri = mongoMemoryServer.getUri();
        console.log('✅ In-Memory MongoDB running at:', uri);
      } catch (memErr) {
        console.warn('⚠️ Could not start mongodb-memory-server:', memErr.message);
      }
    }

    if (uri) {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Warning: ${error.message}`);
  }
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
