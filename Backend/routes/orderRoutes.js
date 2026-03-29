const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// POST /api/orders - place order from cart
router.post('/', protect, async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total and prepare order items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;
      // In a real app we check stock here
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
      
      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    const createdOrder = await order.save();

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(createdOrder);
  } catch (err) {
    res.status(500).json({ error: "Server error placing order" });
  }
});

// GET /api/orders/my - current user's order history
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching orders" });
  }
});

// GET /api/orders/:id - single order detail
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name image price');
      
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching order" });
  }
});

// PUT /api/orders/:id/cancel - cancel order if pending
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    
    // Allow admin or exact user
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: "Cannot cancel order that is not pending" });
    }

    order.status = 'cancelled';
    const updatedOrder = await order.save();

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: "Server error cancelling order" });
  }
});

module.exports = router;
