const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Shop = require('../models/Shop');
const { protect } = require('../middleware/auth');

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register
router.post('/register/:role', async (req, res) => {
  try {
    const role = req.params.role;
    if (!['user', 'shopkeeper', 'agent'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role for registration' });
    }

    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({ name, email, password, phone, role });
    const payload = {
      id: user._id, name: user.name, email: user.email, role: user.role
    };
    
    res.status(201).json({
      ...payload,
      token: generateToken(payload)
    });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login/:role', async (req, res) => {
  try {
    const role = req.params.role;
    if (!['user', 'shopkeeper', 'admin', 'agent'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && await user.matchPassword(password)) {
      if (user.role !== role) {
        return res.status(403).json({ message: `Access denied. Expected ${role} credentials.` });
      }

      let shopId = null;
      if (user.role === 'shopkeeper') {
        const shop = await Shop.findOne({ user: user._id });
        if (shop) shopId = shop._id;
      }

      const payload = {
        id: user._id, name: user.name, email: user.email, role: user.role, shopId
      };

      res.json({
        ...payload,
        token: generateToken(payload)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;