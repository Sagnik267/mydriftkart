import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import axios from '../../axiosConfig';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px'
};

const libraries = ['places'];

export default function ShopLocationManager({ shopName }) {
  const [location, setLocation] = useState(null);
  const [addressRaw, setAddressRaw] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/shop/profile");
      if (res.data && res.data.location) {
        setLocation(res.data.location);
        setAddressRaw(res.data.location.address || '');
      } else {
        // Default to a central location if not set
        setLocation({ lat: 19.0760, lng: 72.8777, address: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    // Reverse geocoding (mock or real)
    let newAddress = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
    
    if (window.google && window.google.maps) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results[0]) {
            newAddress = results[0].formatted_address;
          }
          setLocation({ lat, lng, address: newAddress });
          setAddressRaw(newAddress);
        });
    } else {
        setLocation({ lat, lng, address: newAddress });
        setAddressRaw(newAddress);
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.put("/api/shop/profile", {
        location: {
          ...location,
          address: addressRaw
        }
      });
      alert('Shop location saved successfully!');
    } catch (err) {
      alert('Failed to save location.');
    }
    setIsSaving(false);
  };

  return (
    <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)'}}>
      <h2 style={{marginTop: 0, color: 'var(--primary)', fontFamily: 'var(--font-display)'}}>Store Location Settings</h2>
      <p style={{color: 'var(--text-muted)', marginBottom: '20px'}}>
        Set your physical store location so nearby customers can discover you on the map.
        Click exactly on the map to drop a pin.
      </p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
         <input 
           style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-default)', color: 'var(--text)' }}
           value={addressRaw}
           onChange={e => setAddressRaw(e.target.value)}
           placeholder="Stree Address, City, Pincode"
         />
         <button onClick={handleSave} disabled={isSaving} style={{ padding: '10px 20px', background: 'var(--primary)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'}}>
           {isSaving ? 'Saving...' : 'Save Location'}
         </button>
      </div>

      <div style={{ border: '2px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
        {isLoaded && location ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: location.lat, lng: location.lng }}
            zoom={13}
            onClick={onMapClick}
          >
            <Marker 
              position={{ lat: location.lat, lng: location.lng }}
              icon="https://maps.google.com/mapfiles/ms/icons/store-locator.png"
            />
          </GoogleMap>
        ) : <p style={{padding: '20px'}}>Loading Map Engine...</p>}
      </div>
    </div>
  );
}
