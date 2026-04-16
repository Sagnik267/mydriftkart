import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import axios from '../../axiosConfig';

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '8px',
  border: '1px solid var(--border)'
};

const libraries = ['places'];

export default function AllShopsMap() {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await axios.get('/api/shops/all');
        setShops(res.data);
      } catch (err) {
        console.error("Failed to fetch all shops", err);
      }
    };
    fetchShops();
  }, []);

  const getFilteredShops = () => {
    return shops.filter(shop => {
      if (!shop.location) return false;
      if (categoryFilter && shop.category !== categoryFilter) return false;
      if (statusFilter !== '' && String(shop.isActive) !== statusFilter) return false;
      if (cityFilter && !shop.location.address.toLowerCase().includes(cityFilter.toLowerCase())) return false;
      return true;
    });
  };

  const filteredShops = getFilteredShops();
  
  // Extract unique categories
  const categories = [...new Set(shops.map(s => s.category).filter(Boolean))];

  return (
    <div>
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Filter by City..." 
          value={cityFilter} 
          onChange={e => setCityFilter(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text)' }}
        />
        <select 
          value={categoryFilter} 
          onChange={e => setCategoryFilter(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text)' }}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text)' }}
        >
          <option value="">All Statuses</option>
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
        </select>
      </div>

      <div className="map-wrapper">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: 19.0760, lng: 72.8777 }} // Default to India/Mumbai
            zoom={5} // Zoom out to show wider range
          >
            {filteredShops.map(shop => (
              <Marker
                key={shop._id}
                position={{ lat: shop.location.lat, lng: shop.location.lng }}
                icon={shop.isActive ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png" : "https://maps.google.com/mapfiles/ms/icons/red-dot.png"}
                onClick={() => setSelectedShop(shop)}
              />
            ))}

            {selectedShop && (
              <InfoWindow
                position={{ lat: selectedShop.location.lat, lng: selectedShop.location.lng }}
                onCloseClick={() => setSelectedShop(null)}
              >
                <div style={{ color: '#000', padding: '5px' }}>
                  <h3 style={{ margin: '0 0 5px 0' }}>{selectedShop.name}</h3>
                  <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}>Owner: <strong>{selectedShop.user?.name || 'Unknown'}</strong></p>
                  <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}>Category: {selectedShop.category}</p>
                  <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}>Status: {selectedShop.isActive ? '✅ Active' : '❌ Inactive'}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : <p>Loading Admin Global Map...</p>}
      </div>
      <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Showing {filteredShops.length} shops with valid locations.
      </div>
    </div>
  );
}
