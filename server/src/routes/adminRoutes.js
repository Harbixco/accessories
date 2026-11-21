const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { sendDealerApprovalNotification } = require('../services/emailService');

// All routes here require Admin privileges
router.use(verifyToken, isAdmin);

// @route   GET /api/admin/dealers
// @desc    List all B2B dealers with status filter
router.get('/dealers', async (req, res) => {
  try {
    const { status } = req.query;
    const query = { role: 'dealer' };
    if (status && status !== 'all') {
      query.b2bStatus = status;
    }
    const dealers = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: dealers.length, dealers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/admin/dealers/:id/status
// @desc    Approve or reject a dealer application
router.patch('/dealers/:id/status', async (req, res) => {
  try {
    const { b2bStatus, creditLimit, paymentTerms } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(b2bStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updateFields = { b2bStatus };
    if (creditLimit !== undefined) updateFields.creditLimit = creditLimit;
    if (paymentTerms) updateFields.paymentTerms = paymentTerms;

    const user = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Dealer not found' });
    }

    // If status changed to approved, send confirmation email to the dealer
    if (b2bStatus === 'approved') {
      sendDealerApprovalNotification(user).catch((err) =>
        console.warn('Could not dispatch dealer approval email:', err.message)
      );
    }

    res.json({
      success: true,
      message: `Dealer account status updated to: ${b2bStatus}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all wholesale orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('dealer', 'companyName vatId email contactName').sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/admin/orders/:id/status
// @desc    Update order status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status, paymentStatus, trackingCode } = req.body;
    const update = {};
    if (status) update.status = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    if (trackingCode) update.trackingCode = trackingCode;

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/stats
// @desc    Admin summary metrics
router.get('/stats', async (req, res) => {
  try {
    const pendingDealers = await User.countDocuments({ role: 'dealer', b2bStatus: 'pending' });
    const approvedDealers = await User.countDocuments({ role: 'dealer', b2bStatus: 'approved' });
    const totalProducts = await Product.countDocuments();
    const orders = await Order.find();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalNet || 0), 0);

    res.json({
      success: true,
      stats: {
        pendingDealers,
        approvedDealers,
        totalProducts,
        totalOrders: orders.length,
        totalRevenue: Number(totalRevenue.toFixed(2)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
