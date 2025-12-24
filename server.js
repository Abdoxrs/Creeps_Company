import app from "./App.js";
import connectDB from "./Config/DB.js";

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    console.log('Connected to MongoDB ✅');
    app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}`);
    });
  }).catch((err) => {
    console.error('Error connecting to MongoDB: ', err);
    process.exit(1);
});