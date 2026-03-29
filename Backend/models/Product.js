const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: "A great product" },
  image: { type: String, default: "https://via.placeholder.com/300" },
  category: { type: String, required: true, default: "General" },
  stock: { type: Number, required: true, default: 0 },
  shop: String,
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);