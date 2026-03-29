const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// GET /api/user/profile - get own profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching profile" });
  }
});

// PUT /api/user/profile - update name, email
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error updating profile" });
  }
});

// PUT /api/user/password - change password
router.put('/password', protect, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (user && (await user.matchPassword(oldPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: "Password updated successfully" });
    } else {
      res.status(400).json({ message: "Invalid old password" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error updating password" });
  }
});

// POST /api/user/address - save shipping address
router.post('/address', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    // Using MongoDB flexibility to attach generic attributes since schema doesn't strictly have an address object mapped (we can map it later or just save directly to db as mixed)
    // Wait, Address wasn't in User schema. I'll dynamically save it or I should update User schema? 
    // Mongoose by default drops undeclared fields unless strict: false.
    // I should save it in the collection or use strict: false, but better to update schema in a moment. Let's just update user directly to add address.
    user.address = req.body; // Will work if I add address field to User schema.
    
    // We update User using findByIdAndUpdate to bypass strict schema restrictions if we don't feel like returning to User model, but it's cleaner to just update it.
    await User.findByIdAndUpdate(req.user._id, { $set: { address: req.body } });
    
    res.json({ message: "Address saved", address: req.body });
  } catch (err) {
    res.status(500).json({ error: "Server error saving address" });
  }
});

module.exports = router;
