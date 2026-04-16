const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Base protect: must be logged in (General)
const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    // Also attach shopId from token payload directly onto req.user if present
    if (decoded.shopId) {
      req.user.shopId = decoded.shopId;
    }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired, please login again', isExpired: true });
    }
    res.status(401).json({ message: 'Token invalid' });
  }
};

// Strict Role Protections
const protectUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a User.' });
  }
};

const protectShopkeeper = (req, res, next) => {
  if (req.user && req.user.role === 'shopkeeper') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a Shopkeeper.' });
  }
};

const protectAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an Admin.' });
  }
};

const protectAgent = (req, res, next) => {
  if (req.user && req.user.role === 'agent') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an Agent.' });
  }
};

module.exports = { protect, protectUser, protectShopkeeper, protectAdmin, protectAgent };