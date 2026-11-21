const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const { sendDealerRegistrationAdminAlert } = require('../services/emailService');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'bc_accessories_jwt_secret_key_2026_super_secure', {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new B2B wholesale dealer
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const {
      companyName,
      legalForm,
      vatId,
      contactName,
      email,
      password,
      phone,
      billingAddress,
      shippingAddress,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const user = await User.create({
      companyName,
      legalForm: legalForm || 'GmbH',
      vatId,
      contactName,
      email,
      password,
      phone,
      role: 'dealer',
      b2bStatus: 'pending', // Requires admin approval
      billingAddress: billingAddress || {},
      shippingAddress: shippingAddress || billingAddress || {},
    });

    const token = signToken(user._id);

    // Fire email notification to admin asynchronously (without blocking HTTP response)
    sendDealerRegistrationAdminAlert(user).catch((err) =>
      console.warn('Could not dispatch admin registration email:', err.message)
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        companyName: user.companyName,
        contactName: user.contactName,
        email: user.email,
        role: user.role,
        b2bStatus: user.b2bStatus,
        vatId: user.vatId,
      },
      message: 'Registration submitted successfully! Your B2B account is pending verification.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login dealer or admin
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        companyName: user.companyName,
        contactName: user.contactName,
        email: user.email,
        role: user.role,
        b2bStatus: user.b2bStatus,
        vatId: user.vatId,
        billingAddress: user.billingAddress,
        shippingAddress: user.shippingAddress,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', verifyToken, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
