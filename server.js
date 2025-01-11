const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error('Database connection failed', error));


  require('dotenv').config();
  const mongoose = require('mongoose');
  
  // Use your MongoDB URI from the .env file
  const MONGO_URI = process.env.MONGO_URI;
  
  // Connect to MongoDB
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch(err => console.error("Error connecting to MongoDB Atlas:", err));
  