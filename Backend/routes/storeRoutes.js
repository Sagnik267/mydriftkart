const express = require("express");
const router = express.Router();
const Store = require("../models/Store");
const mongoose = require("mongoose");

// @route   GET /api/stores/nearby
// @desc    Get nearby stores based on location
// @access  Public
router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and Longitude are required." });
    }

    const maxDistanceInMeters = parseInt(radius); // default 5000m

    // Find nearby stores using GeoJSON 2dsphere index
    const nearbyStores = await Store.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)], // Remember: [longitude, latitude]
          },
          distanceField: "distance",
          maxDistance: maxDistanceInMeters,
          spherical: true,
        },
      },
      {
        $sort: { distance: 1 }, // Sort closest first
      },
    ]);

    res.status(200).json({
      success: true,
      count: nearbyStores.length,
      data: nearbyStores,
    });
  } catch (error) {
    console.error("Error fetching nearby stores:", error);
    res.status(500).json({ success: false, error: "Server Error processing coordinates." });
  }
});

module.exports = router;
