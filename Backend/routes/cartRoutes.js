const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { protect } = require('../middleware/auth');

// GET /api/cart - get current user's cart
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching cart" });
  }
});

// POST /api/cart - add item to cart
router.post('/', protect, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    // Populate for returning the updated populated cart
    cart = await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Server error adding to cart" });
  }
});

// PUT /api/cart/:productId - update quantity
router.put('/:productId', protect, async (req, res) => {
  const { quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const existingItem = cart.items.find(item => item.product.toString() === req.params.productId);
    if (existingItem) {
      existingItem.quantity = Number(quantity);
      await cart.save();
    }
    
    cart = await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Server error updating cart" });
  }
});

// DELETE /api/cart/:productId - remove item
router.delete('/:productId', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    await cart.save();
    
    cart = await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Server error removing from cart" });
  }
});

// DELETE /api/cart - clear entire cart
router.delete('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Server error clearing cart" });
  }
});

module.exports = router;
