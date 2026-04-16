const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  targetRole: { type: String, enum: ['all', 'user', 'shopkeeper', 'agent', 'specific'] },
  targetUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isBanner: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
