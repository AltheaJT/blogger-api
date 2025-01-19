const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/blogs', blogRoutes);

// Environment Variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas!');
    // The `app.listen()` call is removed for testing purposes
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit the process with failure
  });

// Export the app to be used in tests
module.exports = app;
