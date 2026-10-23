import dotenv from 'dotenv';
dotenv.config();

import app from "./App.js";
import connectDB from "./Config/DB.js";
import validateEnv from "./utilities/validateEnv.js";

validateEnv();
// just testing
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error connecting to MongoDB:', err);
    process.exit(1);
  });