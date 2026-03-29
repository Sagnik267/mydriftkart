const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');

// Get all users (admin only)
router.get('/users', protect, isAdmin, async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// Delete a user (admin only)
router.delete('/users/:id', protect, isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

// Get all products (admin only)
router.get('/products', protect, isAdmin, async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// Delete a product (admin only)
router.delete('/products/:id', protect, isAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

module.exports = router;