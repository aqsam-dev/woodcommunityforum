require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const postRoutes = require('./routes/posts');

app.use('/api/posts', postRoutes);

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', dbState: mongoose.connection.readyState });
});

// Connect to MongoDB, then start the server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit process with failure
  }
};

startServer();