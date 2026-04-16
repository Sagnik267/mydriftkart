import React, { useState, useEffect } from 'react';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import './LocationDetector.css';

export default function LocationDetector({ onLocationChange }) {
  const [address, setAddress] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // On mount, check if we have saved location
    const saved = localStorage.getItem('userLocation');
    if (saved) {
      const loc = JSON.parse(saved);
      setAddress({ label: loc.address, value: loc });
      onLocationChange(loc);
    } else {
      handleAutoDetect();
    }
  }, [onLocationChange]);

  const handleAutoDetect = () => {
    setIsLocating(true);
    setErrorMsg("");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          try {
            // Optional: Reverse geocode to get an address string using Google Maps Geocoder if key is provided
            // For now, we simulate finding the address or use a generic one if missing
            const locData = { 
              lat, 
              lng, 
              address: `GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})` 
            };
            
            // Try to find the real address if API is loaded
            if (window.google && window.google.maps) {
              const geocoder = new window.google.maps.Geocoder();
              geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === "OK" && results[0]) {
                  locData.address = results[0].formatted_address;
                }
                saveAndEmit(locData);
              });
            } else {
              saveAndEmit(locData);
            }
          } catch (err) {
            saveAndEmit({ lat, lng, address: `Detected Location (${lat.toFixed(2)}, ${lng.toFixed(2)})` });
          }
        },
        (error) => {
          setIsLocating(false);
          setErrorMsg("Could not detect location. Please search manually.");
        }
      );
    } else {
      setIsLocating(false);
      setErrorMsg("Geolocation not supported by your browser.");
    }
  };

  const saveAndEmit = (loc) => {
    localStorage.setItem('userLocation', JSON.stringify(loc));
    setAddress({ label: loc.address, value: loc });
    setIsLocating(false);
    onLocationChange(loc);
  };

  const handlePlaceSelect = async (val) => {
    if (!val) return;
    setAddress(val);
    try {
      const results = await geocodeByAddress(val.label);
      const latLng = await getLatLng(results[0]);
      
      const locData = {
        lat: latLng.lat,
        lng: latLng.lng,
        address: val.label
      };
      saveAndEmit(locData);
    } catch(err) {
      setErrorMsg("Failed to convert address to coordinates");
    }
  };

  return (
    <div className="location-detector-bar">
      <div className="location-detector-content">
        <div className="icon">📍</div>
        <div className="input-container">
          <label>Delivering to:</label>
          <div className="search-wrapper">
            <GooglePlacesAutocomplete
              selectProps={{
                value: address,
                onChange: handlePlaceSelect,
                placeholder: 'Search for your delivery address...'
              }}
            />
          </div>
        </div>
        <button className="btn-auto-detect" onClick={handleAutoDetect} disabled={isLocating}>
          {isLocating ? 'Locating...' : '🧭 Use Current Location'}
        </button>
      </div>
      {errorMsg && <div className="error-msg">{errorMsg}</div>}
    </div>
  );
}
