const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const Empsrouter = require('./Routers/Emps.router');
const Depsrouter = require('./Routers/Deps.router');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/GO')
  .then(() => {console.log('Connected to MongoDB ✅');})
.catch((err) => {console.error('Error connecting to MongoDB: ', err);});

//logging middleware
app.use(morgan("dev"));

// Middleware to parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/employees', Empsrouter)
app.use('/departments', Depsrouter)

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});