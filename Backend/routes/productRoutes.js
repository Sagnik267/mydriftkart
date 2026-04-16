const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');
const Category = require('../models/Category');

// GET /api/products/categories - list all unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({}, { name: 1, slug: 1, imageUrl: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching categories" });
  }
});

// GET /api/products - all products with search, filter, sort, pagination
router.get('/', async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 10 } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (category) {
      query.category = category;
    }
    if (req.query.featured === 'true') {
      query.featured = true;
    }

    let sortOptions = {};
    if (sort === 'asc') sortOptions.price = 1;
    if (sort === 'desc') sortOptions.price = -1;

    const products = await Product.find(query)
      .populate('category')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalProducts: total,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error fetching products" });
  }
});

// GET /api/products/:id - single product detail with avg rating
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Calculate average rating
    const reviews = await Review.find({ product: product._id });
    const avgRating = reviews.length > 0 
      ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1) 
      : 0;

    res.json({ product, avgRating, numReviews: reviews.length });
  } catch (err) {
    res.status(500).json({ error: "Server error fetching product" });
  }
});

module.exports = router;
