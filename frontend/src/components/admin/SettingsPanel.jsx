import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';

export default function SettingsPanel() {
  const [settings, setSettings] = useState({
    commissionPercent: 10,
    minOrderAmount: 50,
    deliveryRadiusKm: 10,
    maintenanceMode: false
  });

  useEffect(() => {
    axios.get('/api/admin/settings').then(res => {
      if (res.data) setSettings(res.data);
    }).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/admin/settings', settings);
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings');
    }
  };

  return (
    <div className="admin-container-block">
      <h2>⚙️ System Configuration</h2>
      <form onSubmit={handleSave} style={{ marginTop: '20px', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Platform Commission (%)</label>
          <input type="number" name="commissionPercent" value={settings.commissionPercent} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Minimum Order Amount ($)</label>
          <input type="number" name="minOrderAmount" value={settings.minOrderAmount} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Global Delivery Radius (km)</label>
          <input type="number" name="deliveryRadiusKm" value={settings.deliveryRadiusKm} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} />
            Enable Global Maintenance Mode (App offline)
          </label>
        </div>
        <button type="submit" className="ripple-btn" style={{ marginTop: '10px' }}>Save Configurations</button>
      </form>
    </div>
  );
}
