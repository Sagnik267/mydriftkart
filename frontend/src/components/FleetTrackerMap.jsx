import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { io } from "socket.io-client";

// Leaflet fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const fleetIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2830/2830305.png", // Blue delivery bike
  iconSize: [35, 35],
});

export default function FleetTrackerMap({ role }) {
  // Map of agent string id -> location object { lat, lng, timestamp, agentName, orderId }
  const [fleet, setFleet] = useState({});

  useEffect(() => {
    const token = localStorage.getItem(role === 'admin' ? "adminToken" : "token");
    if (!token) return;

    const socket = io("http://localhost:5000", { auth: { token } });

    socket.on("connect", () => {
      // Join the correct tracking room
      if (role === 'admin') {
        socket.emit("joinAdminTracker");
      } else if (role === 'shopkeeper') {
        socket.emit("joinShopTracker");
      }
    });

    socket.on("locationUpdate", (data) => {
      setFleet(prev => ({
        ...prev,
        [data.agentId]: data
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [role]);

  const agents = Object.values(fleet);

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
      <MapContainer center={[19.0760, 72.8777]} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
        />

        {agents.map((agent) => (
          <Marker key={agent.agentId} position={[agent.lat, agent.lng]} icon={fleetIcon}>
            <Popup>
              <strong>{agent.agentName}</strong><br />
              {agent.orderId ? `On delivery: #${agent.orderId.substring(0,6)}` : 'Idle / Moving'}<br />
              <small>Last ping: {new Date(agent.timestamp).toLocaleTimeString()}</small>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Overlay status */}
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, background: 'rgba(0,0,0,0.8)', padding: '0.5rem', borderRadius: '4px', color: '#fff', fontSize: '0.8rem' }}>
        Active Agents: {agents.length}
      </div>
    </div>
  );
}
