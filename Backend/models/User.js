const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { 
    type: String, 
    enum: ['user', 'shopkeeper', 'admin', 'agent'], 
    default: 'user' 
  },
  isSuspended: { type: Boolean, default: false },
  agentStatus: { type: String, enum: ['online', 'offline'], default: 'offline' },
  agentDetails: {
    vehicleType: { type: String },
    area: { type: String },
    totalDeliveries: { type: Number, default: 0 },
    rating: { type: Number, default: 0 }
  },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
    timestamp: { type: Date }
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String }
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);