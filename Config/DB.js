import 'dotenv/config';
import dns from 'node:dns';
import mongoose from "mongoose";

// Workaround for Windows/Node.js c-ares DNS resolution where local loopback (127.0.0.1)
// causes 'querySrv ECONNREFUSED' when resolving Atlas mongodb+srv URIs.
try {
  const servers = dns.getServers();
  if (!servers.length || servers.includes('127.0.0.1')) {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  }
} catch {
  // Fall back silently if dns.setServers is restricted
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI environment variable is required');
  }

  // Set up connection event listeners
  mongoose.connection.on('connected', () => {
    console.log('📡 Mongoose connected to DB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ Mongoose disconnected from DB');
  });

  try {
    return await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed:');
    console.error(`   Message: ${error.message}`);
    if (uri.includes('mongodb+srv://')) {
      console.error('\n💡 Mongo Atlas Troubleshooting Tips:');
      console.error('   1. Check Atlas Network Access: Ensure your IP address (or 0.0.0.0/0) is whitelisted.');
      console.error('   2. Verify Atlas Database User: Check username & password in .env.');
      console.error('   3. Special characters in password must be URL-encoded (e.g. @ -> %40).');
    }
    throw error;
  }
};

export default connectDB;
