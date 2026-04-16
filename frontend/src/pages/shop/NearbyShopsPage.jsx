import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import axios from '../../axiosConfig';
import LocationDetector from '../../components/shop/LocationDetector';
import { useNavigate } from 'react-router-dom';
import './NearbyShopsPage.css';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const libraries = ['places'];

export default function NearbyShopsPage() {
  const [userLocation, setUserLocation] = useState(null);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [radius, setRadius] = useState(5); // Default 5km radius
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const fetchNearbyShops = useCallback(async (loc, rad) => {
    try {
      const res = await axios.get(`/api/shops/nearby?lat=${loc.lat}&lng=${loc.lng}&radius=${rad}`);
      setShops(res.data);
    } catch (err) {
      console.error("Failed to fetch shops", err);
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyShops(userLocation, radius);
    }
  }, [userLocation, radius, fetchNearbyShops]);

  const handleLocationChange = (loc) => {
    setUserLocation(loc);
  };

  return (
    <div className="nearby-page">
      {isLoaded ? <LocationDetector onLocationChange={handleLocationChange} /> : <div style={{padding: '20px'}}>Loading Google Maps...</div>}
      
      {!userLocation ? (
        <div className="placeholder-msg">
           Detecting location or please enter an address above to find nearby shops...
        </div>
      ) : (
        <div className="nearby-content">
          <div className="map-section">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={{ lat: userLocation.lat, lng: userLocation.lng }}
                zoom={13}
              >
                {/* User Location Pin */}
                <Marker 
                  position={{ lat: userLocation.lat, lng: userLocation.lng }}
                  icon="https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  title="You"
                />

                {/* Shop Pins */}
                {shops.map(shop => (
                  <Marker
                    key={shop._id}
                    position={{ lat: shop.location.lat, lng: shop.location.lng }}
                    icon="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                    onClick={() => setSelectedShop(shop)}
                  />
                ))}

                {selectedShop && (
                  <InfoWindow
                    position={{ lat: selectedShop.location.lat, lng: selectedShop.location.lng }}
                    onCloseClick={() => setSelectedShop(null)}
                  >
                    <div className="info-window">
                      <h4>{selectedShop.name}</h4>
                      <p>{selectedShop.category}</p>
                      <p>{selectedShop.distance_km} km away | ~{selectedShop.estimated_delivery_minutes} mins</p>
                      <button className="btn-order-now" onClick={() => navigate(`/shop/${selectedShop._id}`)}>
                        Visit Shop
                      </button>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            ) : <p>Loading Map...</p>}
          </div>

          <div className="shop-list-section">
            <div className="list-header">
              <h2>Top Shops Near You</h2>
              <select value={radius} onChange={e => setRadius(Number(e.target.value))} className="radius-filter">
                <option value={1}>1 km radius</option>
                <option value={3}>3 km radius</option>
                <option value={5}>5 km radius</option>
                <option value={10}>10 km radius</option>
              </select>
            </div>
            
            {shops.length === 0 ? (
              <p className="no-shops">No shops found within {radius} km. Try expanding the radius!</p>
            ) : (
              <div className="shop-cards">
                {shops.map(shop => (
                  <div key={shop._id} className="shop-card" onClick={() => navigate(`/shop/${shop._id}`)}>
                    <img src={shop.logo || 'https://placehold.co/150'} alt={shop.name} className="shop-logo"/>
                    <div className="shop-info">
                      <h3>{shop.name}</h3>
                      <span className="shop-cat">{shop.category}</span>
                      <div className="shop-stats">
                        <span>⭐ {shop.rating}</span>
                        <span>📏 {shop.distance_km} km</span>
                        <span>⏱️ {shop.estimated_delivery_minutes} mins</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
