const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const Settings = require('../models/Settings');

// ==========================================
// 1. DASHBOARD & REVENUE AGGREGATION
// ==========================================
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalShopkeepers = await User.countDocuments({ role: 'shopkeeper' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Revenue logic
    const deliveredOrders = await Order.find({ status: 'delivered', isPaid: true });
    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Advanced 30-day daily charts
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dailySalesAggr = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Orders By Status (Pie Chart)
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalShopkeepers,
      totalProducts,
      totalOrders,
      totalRevenue,
      dailySalesAggr,
      ordersByStatus
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 2. ORDER MANAGEMENT
// ==========================================
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name phone')
      .populate('deliveryAgent', 'name phone')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status, note, cancelReason } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.status = status;
    if (cancelReason) order.cancelReason = cancelReason;
    
    order.timeline.push({ status, note: note || `Admin changed status to ${status}` });
    await order.save();
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/orders/:id/assign', async (req, res) => {
  try {
    const { agentId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.deliveryAgent = agentId;
    order.status = 'confirmed';
    order.timeline.push({ status: 'confirmed', note: `Admin assigned agent ${agentId}` });
    await order.save();
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 3. DELIVERY AGENT MANAGEMENT
// ==========================================
router.get('/agents', async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('-password');
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/agents', async (req, res) => {
  try {
    const { name, email, phone, password, vehicleType, area } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const agent = await User.create({
      name, email, phone, password, role: 'agent',
      agentDetails: { vehicleType, area, totalDeliveries: 0, rating: 5 }
    });
    res.json(agent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/users/:id/suspend', async (req, res) => {
  try {
    const { isSuspended } = req.body;
    const user = await User.findById(req.params.id);
    user.isSuspended = isSuspended;
    await user.save();
    res.json({ message: `User suspension toggled` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 4. USER MANAGEMENT
// ==========================================
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 5. SHOP MANAGEMENT
// ==========================================
router.get('/shops', async (req, res) => {
  try {
    const shops = await Shop.find().populate('user', 'name email');
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/shops/:id/status', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    shop.status = req.body.status;
    await shop.save();
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/shops/:id/edit', async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 6. PRODUCT MANAGEMENT
// ==========================================
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('shopkeeper', 'name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const prod = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(prod);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 7. NOTIFICATIONS
// ==========================================
router.post('/notifications', async (req, res) => {
  try {
    const notif = await Notification.create(req.body);
    // In a real prod environment, you would push to APNs or FCM here
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/notifications', async (req, res) => {
  try {
    const notifs = await Notification.find().sort({ createdAt: -1 });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 8. SETTINGS
// ==========================================
router.get('/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    Object.assign(settings, req.body);
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;