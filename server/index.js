
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://192.168.100.138:5173'],
  credentials: true,
}));
app.use(express.json());

// DB Config
const db = 'mongodb://localhost:27017/clarity-db';

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Auth Routes
app.use('/api/auth', require('./routes/auth'));

// Protected Routes (apply authMiddleware)
app.use('/api/projects', authMiddleware, require('./routes/projects'));
app.use('/api/tasks', authMiddleware, require('./routes/tasks'));
app.use('/api/payments', authMiddleware, require('./routes/payments'));

app.listen(port, () => console.log(`Server started on port ${port}`));
