const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

// POST /api/reviews - add review
router.post('/', protect, async (req, res) => {
  const { productId, rating, comment } = req.body;
  try {
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId
    });
    
    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    const review = new Review({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: "Server error creating review" });
  }
});

// GET /api/reviews/:productId - all reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching reviews" });
  }
});

// DELETE /api/reviews/:id - delete own review
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review removed" });
  } catch (err) {
    res.status(500).json({ error: "Server error deleting review" });
  }
});

module.exports = router;
