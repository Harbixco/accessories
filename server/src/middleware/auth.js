const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bc_accessories_jwt_secret_key_2026_super_secure');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token. User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token is expired or invalid.' });
  }
};

// Check if user is an approved B2B wholesale partner
const isApprovedB2B = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Please log in.' });
  }

  // Admins always have access
  if (req.user.role === 'admin') {
    return next();
  }

  if (req.user.b2bStatus !== 'approved') {
    return res.status(403).json({
      success: false,
      message: 'Your B2B dealer account is currently pending verification. Wholesale access and net pricing will be unlocked once reviewed.',
      status: req.user.b2bStatus,
    });
  }

  next();
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
};

module.exports = { verifyToken, isApprovedB2B, isAdmin };
