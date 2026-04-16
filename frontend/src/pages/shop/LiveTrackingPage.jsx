import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import axios from "../../axiosConfig";
import { io } from "socket.io-client";

// Fix Leaflet's default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png", // Demo scooter icon
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

// A component to handle routing lines dynamically
const RoutingMachine = ({ start, end }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || !start || !end) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: '#3b82f6', weight: 4 }]
      },
      createMarker: () => null // We handle markers ourselves
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, start, end]);
  return null;
};

// Component to recenter map when agent moves
const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

export default function LiveTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [agentLocation, setAgentLocation] = useState(null); // [lat, lng]
  const [destination, setDestination] = useState(null); // [lat, lng]
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
    
    // Setup Socket
    const token = localStorage.getItem("token");
    const newSocket = io("http://localhost:5000", { auth: { token } });
    
    newSocket.on("connect", () => {
      newSocket.emit("joinOrderRoom", id);
    });

    newSocket.on("locationUpdate", (data) => {
      setAgentLocation([data.lat, data.lng]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get(`/api/orders/${id}`);
      setOrder(res.data);
      if (res.data.shippingAddress?.lat && res.data.shippingAddress?.lng) {
        setDestination([res.data.shippingAddress.lat, res.data.shippingAddress.lng]);
      } else {
        // Fallback demo coordinates if User didn't have true GPS
        setDestination([19.0800, 72.8800]); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!order) return <div style={{padding: '2rem', color: '#fff'}}>Loading delivery details...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a0a0f', color: '#fff' }}>
      <header style={{ padding: '1.5rem', background: '#13131a', borderBottom: '1px solid #333' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#fbbf24' }}>Live Tracking: #{order._id.substring(0,6)}</h1>
        <p style={{ margin: '0.5rem 0 0 0', color: '#9ca3af' }}>Status: 
          <span style={{ marginLeft: '10px', padding: '0.2rem 0.5rem', background: '#3b82f6', color: '#fff', borderRadius: '4px' }}>
            {order.status.replace('_', ' ').toUpperCase()}
          </span>
        </p>
      </header>
      
      <div style={{ flex: 1, position: 'relative' }}>
        {/* We center dynamically on the agent or the destination */}
        <MapContainer center={agentLocation || destination || [19.0760, 72.8777]} zoom={15} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Delivery Destination Marker */}
          {destination && (
            <Marker position={destination}>
              <Popup>Your Delivery Location</Popup>
            </Marker>
          )}

          {/* Moving Agent Marker with Recenter */}
          {agentLocation && order.status === 'on_the_way' && (
            <>
              <Marker position={agentLocation} icon={deliveryIcon}>
                <Popup>Delivery Partner is here</Popup>
              </Marker>
              <RecenterAutomatically lat={agentLocation[0]} lng={agentLocation[1]} />
            </>
          )}

          {/* Draw Polyline if we have both */}
          {agentLocation && destination && order.status === 'on_the_way' && (
            <RoutingMachine start={agentLocation} end={destination} />
          )}

        </MapContainer>
        
        {!agentLocation && order.status !== 'delivered' && (
          <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: 'rgba(0,0,0,0.8)', padding: '1rem', borderRadius: '8px', border: '1px solid #fbbf24' }}>
            Waiting for delivery partner to start moving...
          </div>
        )}
      </div>
    </div>
  );
}
