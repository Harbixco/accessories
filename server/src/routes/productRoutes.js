const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyToken, isAdmin } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to check user auth optionally (for price gating)
const getOptionalUser = async (req) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bc_accessories_jwt_secret_key_2026_super_secure');
      return await User.findById(decoded.id);
    }
  } catch (err) {
    return null;
  }
  return null;
};

let seededPromise = null;
const ensureLaptopsSeeded = async () => {
  if (seededPromise) return seededPromise;
  seededPromise = (async () => {
    try {
      const count = await Product.countDocuments({ sku: /^BCA-LAP-/ });
      if (count < 8) {
        console.log(`[Auto-Sync] Syncing missing laptops into MongoDB (${count}/8)...`);
        const seedProducts = require('../seed/seedData');
        const laptops = seedProducts.filter((p) => p.sku.startsWith('BCA-LAP-'));
        for (const item of laptops) {
          await Product.findOneAndUpdate({ sku: item.sku }, item, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true });
        }
        console.log('[Auto-Sync] All 8 laptops synced to MongoDB.');
      }
    } catch (err) {
      console.warn('[Auto-Sync Warning]:', err.message);
    }
  })();
  return seededPromise;
};

// @route   GET /api/products
// @desc    Get all products with filtering, search & device compatibility
// @access  Public (Prices are gated unless user is approved B2B)
router.get('/', async (req, res) => {
  try {
    await ensureLaptopsSeeded();
    const { brand, category, device, search, sort, page = 1, limit = 40 } = req.query;
    const query = {};

    if (brand && brand !== 'All') {
      query.brand = brand;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (device && device !== 'All') {
      query.compatibleDevices = { $in: [device] };
    }

    if (search) {
      query.$or = [
        { sku: { $regex: search, $options: 'i' } },
        { 'name.de': { $regex: search, $options: 'i' } },
        { 'name.en': { $regex: search, $options: 'i' } },
        { compatibleDevices: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { basePrice: 1 };
    if (sort === 'price-high') sortOption = { basePrice: -1 };
    if (sort === 'name') sortOption = { 'name.en': 1 };

    const products = await Product.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    // Check if the requester is an approved B2B dealer or admin
    const user = await getOptionalUser(req);
    const isApproved = user && (user.role === 'admin' || user.b2bStatus === 'approved');

    // If not approved, gate wholesale prices
    const sanitizedProducts = products.map((p) => {
      const obj = p.toObject();
      if (!isApproved) {
        obj.basePrice = null;
        obj.tieredPricing = [];
        obj.priceGated = true;
      } else {
        obj.priceGated = false;
      }
      return obj;
    });

    res.json({
      success: true,
      count: sanitizedProducts.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      isWholesaleUnlocked: isApproved,
      products: sanitizedProducts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/products/meta/filters
// @desc    Get unique brands, categories, and device models for filter bars
router.get('/meta/filters', async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    const categories = await Product.distinct('category');
    const devices = await Product.distinct('compatibleDevices');

    res.json({
      success: true,
      brands: brands.filter(Boolean),
      categories: categories.filter(Boolean),
      devices: devices.filter(Boolean),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product details
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const user = await getOptionalUser(req);
    const isApproved = user && (user.role === 'admin' || user.b2bStatus === 'approved');

    const obj = product.toObject();
    if (!isApproved) {
      obj.basePrice = null;
      obj.tieredPricing = [];
      obj.priceGated = true;
    } else {
      obj.priceGated = false;
    }

    res.json({ success: true, product: obj, isWholesaleUnlocked: isApproved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/products
// @desc    Create product (Admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (Admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
