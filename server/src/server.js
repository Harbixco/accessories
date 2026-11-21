const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Attempt initial database connection on startup
connectDB().catch((err) => {
  console.warn(`[MongoDB Notice] Initial connect: ${err.message}`);
});

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// Ensure database connection before processing API routes (crucial for Vercel Serverless cold starts)
app.use(async (req, res, next) => {
  if (req.path === '/api/health' || req.path === '/health') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error(`[API DB Error] ${req.method} ${req.path}:`, err.message);
    res.status(500).json({
      success: false,
      message: `Database connection error: ${err.message}. Please verify MongoDB Atlas Network Access whitelist (0.0.0.0/0) and MONGO_URI on Vercel.`,
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Root health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'BC ACCESSORIES',
    model: 'B2B Wholesale Platform',
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[BC Accessories API] Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;

