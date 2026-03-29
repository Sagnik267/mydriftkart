const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

// --- DASHBOARD ROUTE ---
// GET /api/admin/dashboard - Return stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    // Orders count can be mocked or count from Order model if it exists in the future
    const recentOrdersCount = 0; 
    
    res.json({
      totalUsers,
      totalProducts,
      recentOrdersCount
    });
  } catch (err) {
    res.status(500).json({ error: "Server error fetching dashboard stats" });
  }
});

// --- USER ROUTES ---
// GET /api/admin/users - List all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching users" });
  }
});

// PUT /api/admin/users/:id/make-admin - Promote a user to admin
router.put('/users/:id/make-admin', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isAdmin = true;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error promoting user" });
  }
});

// DELETE /api/admin/users/:id - Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: "Server error deleting user" });
  }
});

// --- PRODUCT ROUTES ---
// GET /api/admin/products - List all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching products" });
  }
});

// POST /api/admin/products - Create product
router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error creating product" });
  }
});

// PUT /api/admin/products/:id - Edit product
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error updating product" });
  }
});

// DELETE /api/admin/products/:id - Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: "Server error deleting product" });
  }
});

module.exports = router;