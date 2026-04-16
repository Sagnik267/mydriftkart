const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: { type: String, required: true },
  description: { type: String },
  logo: { type: String, default: 'https://placehold.co/150x150' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  category: { type: String, default: 'General' },
  isActive: { type: Boolean, default: true },
  status: { type: String, enum: ['active', 'suspended', 'pending'], default: 'active' },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);
