const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');

// Haversine formula to calculate distance between two coordinates in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;  
  const dLon = (lon2 - lon1) * Math.PI / 180; 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

// 🌐 GET /api/shops/nearby
// Queries all active shops, calculates distance, and sorts them
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and Longitude are required' });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const maxRadius = parseFloat(radius);

    const shops = await Shop.find({ isActive: true });
    
    // Calculate distance and filter by radius
    const shopsWithDistance = shops.map(shop => {
      // If shop has no location, skip it by giving it a massive distance
      if (!shop.location || typeof shop.location.lat !== 'number' || typeof shop.location.lng !== 'number') {
        return null;
      }
      
      const distance = calculateDistance(userLat, userLng, shop.location.lat, shop.location.lng);
      
      return {
        ...shop.toObject(),
        distance_km: parseFloat(distance.toFixed(2)),
        // Estimate 10 mins per km + 10 mins prep time
        estimated_delivery_minutes: Math.ceil((distance * 10) + 10)
      };
    }).filter(shop => shop !== null && shop.distance_km <= maxRadius);

    // Sort by distance (closest first)
    shopsWithDistance.sort((a, b) => a.distance_km - b.distance_km);

    res.json(shopsWithDistance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🌐 GET /api/shops/all
// Helper for admin map to see ALL shops regardless of active or distance
router.get('/all', async (req, res) => {
  try {
    const shops = await Shop.find().populate('user', 'name email');
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
