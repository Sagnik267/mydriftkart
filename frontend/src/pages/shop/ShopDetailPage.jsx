import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import axios from '../../axiosConfig';
import './ShopDetailPage.css';

const containerStyle = {
  width: '100%',
  height: '300px'
};

const libraries = ['places'];

export default function ShopDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });

  useEffect(() => {
    // 1. Get user location from local storage (saved by LocationDetector)
    const savedLoc = localStorage.getItem('userLocation');
    if (savedLoc) setUserLocation(JSON.parse(savedLoc));

    // 2. Fetch Shop Details & Products
    // Wait, the API might not have a GET /api/shops/:id yet. Let's fetch all and filter or products
    const fetchData = async () => {
      try {
        const prodRes = await axios.get('/api/products'); // Temporary, should filter by shop
        setProducts(prodRes.data.filter(p => p.shopkeeper === id || p.shopkeeper?._id === id));
        
        const shopRes = await axios.get('/api/shops/all');
        const foundShop = shopRes.data.find(s => s.user?._id === id || s._id === id); // We map shop.user._id to ID usually, but here we search by shop._id
        if (foundShop) setShop(foundShop);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    // Calculate Route if we have map loaded, shop location, and user location
    if (isLoaded && shop && shop.location && userLocation) {
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: { lat: userLocation.lat, lng: userLocation.lng },
          destination: { lat: shop.location.lat, lng: shop.location.lng },
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === 'OK') {
            setDirectionsResponse(result);
            setDistance(result.routes[0].legs[0].distance.text);
            setDuration(result.routes[0].legs[0].duration.text);
          }
        }
      );
    }
  }, [isLoaded, shop, userLocation]);

  if (!shop) return <div style={{padding: '2rem'}}>Loading shop...</div>;

  return (
    <div className="shop-detail-page">
      <header className="shop-header">
        <button onClick={() => navigate(-1)} className="btn-back">← Back to Nearby Shops</button>
        <div style={{display: 'flex', gap: '20px', alignItems: 'center', marginTop: '20px'}}>
          <img src={shop.logo} alt={shop.name} className="shop-detail-logo"/>
          <div>
            <h1>{shop.name}</h1>
            <p>{shop.category} | ⭐ {shop.rating}</p>
            <p className="shop-address">📍 {shop.location?.address || 'Address not provided'}</p>
          </div>
        </div>
      </header>

      <section className="shop-map-section">
        <div className="map-info-box">
          <h3>Delivery Details</h3>
          <p><strong>Distance:</strong> {distance || 'Calculating...'}</p>
          <p><strong>Est. Time:</strong> {duration || 'Calculating...'}</p>
        </div>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={shop.location ? { lat: shop.location.lat, lng: shop.location.lng } : {lat: 19.0760, lng: 72.8777}}
            zoom={14}
          >
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
            {!directionsResponse && shop.location && (
               <Marker position={{ lat: shop.location.lat, lng: shop.location.lng }} />
            )}
          </GoogleMap>
        ) : <p>Loading Map...</p>}
      </section>

      <section className="shop-products-section">
        <h2>Products from {shop.name}</h2>
        <div className="products-grid">
          {products.map(p => (
            <div key={p._id} className="product-card">
              <img src={p.image} alt={p.name} />
              <h4>{p.name}</h4>
              <p>₹{p.price}</p>
              <button onClick={() => navigate(`/product/${p._id}`)}>View Details</button>
            </div>
          ))}
          {products.length === 0 && <p>No products found for this shop.</p>}
        </div>
      </section>
    </div>
  );
}
