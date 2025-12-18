import { connect } from 'mongoose';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/GO';


connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB ✅');
    app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB: ', err);
    process.exit(1);
  });
  process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    await connect().connection.close();
    process.exit(0);
});

export default app;