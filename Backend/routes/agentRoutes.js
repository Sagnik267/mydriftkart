const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// 🚚 Get active deliveries for the agent
router.get('/deliveries', async (req, res) => {
  try {
    const orders = await Order.find({ 
      deliveryAgent: req.user._id, 
      status: { $in: ['confirmed', 'picked_up', 'on_the_way'] } 
    }).populate('user', 'name phone').populate('items.product', 'name');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🚚 Update delivery status
router.put('/deliveries/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['picked_up', 'on_the_way', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid delivery status' });
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, deliveryAgent: req.user._id },
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found or not assigned to you' });
    
    // In a full implementation, you might want to send an email/Firebase push notification here
    // notifyUser(order.user, status) -> "Your order is on the way!"

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🚚 (Optional) Get delivery history
router.get('/deliveries/history', async (req, res) => {
  try {
    const orders = await Order.find({ 
      deliveryAgent: req.user._id, 
      status: 'delivered' 
    }).sort({ updatedAt: -1 }).limit(20);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
