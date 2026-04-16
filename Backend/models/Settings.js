const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  commissionPercent: { type: Number, default: 10 },
  minOrderAmount: { type: Number, default: 50 },
  deliveryRadiusKm: { type: Number, default: 10 },
  maintenanceMode: { type: Boolean, default: false },
  globalCategories: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
