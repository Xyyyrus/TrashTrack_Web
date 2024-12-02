import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet"; // Import Leaflet for custom icons
import "leaflet/dist/leaflet.css";

// Marker icon configuration
const markerIcon = L.icon({
  iconUrl: "https://firebasestorage.googleapis.com/v0/b/trashtrack-ac6eb.appspot.com/o/website_assets%2Ftrash-bin.png?alt=media&token=ae278bc1-5e36-4031-a13c-8c356036e0a1", // Default marker icon
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", // Marker shadow
  iconSize: [41, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
});

const mapContainerStyle = {
  height: "100vh",
  width: "100%",
  position: "relative",
};

const buttonContainerStyle = {
  position: "absolute",
  bottom: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: "10px",
  zIndex: 1000,
};

const ViewRoute = ({ path, collections, handleClose }) => {
  const [center, setCenter] = useState(null);

  useEffect(() => {
    if (path && path.length > 0) {
      setCenter({ lat: path[0].lat, lng: path[0].lng });
    }
  }, [path]);

  return center ? (
    <div style={mapContainerStyle}>
      <MapContainer
        center={center}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Polyline positions={path} color="red" weight={5} />
        {collections.map((collection, index) => (
          <Marker
            key={index}
            position={[collection.lat, collection.lng]}
            icon={markerIcon}
          >
            <Popup>
              <span>Collection Point {index + 1}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div style={buttonContainerStyle}>
        <Button variant="contained" color="secondary" onClick={handleClose}>
          Close
        </Button>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default ViewRoute;
