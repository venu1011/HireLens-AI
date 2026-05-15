const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [process.env.CLIENT_URL || "http://localhost:5173", "https://hire-lens-ai-three.vercel.app"],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/analysis', require('./routes/analysis'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'HireLens AI Backend is running', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message || 'File upload error' });
  }
  if (err.message && err.message.toLowerCase().includes('only pdf files are allowed')) {
    return res.status(400).json({ message: 'Only PDF files are allowed' });
  }
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 HireLens AI Backend running on port ${PORT}`);
});
