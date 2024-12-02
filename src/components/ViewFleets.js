import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const mapContainerStyle = {
  height: "80vh",
  width: "100%",
  position: "relative",
};

const ViewFleets = ({ actives }) => {
  const defaultIcon = new L.Icon({
    iconUrl: "https://firebasestorage.googleapis.com/v0/b/trashtrack-ac6eb.appspot.com/o/website_assets%2Fgarbage-pin.png?alt=media&token=b3fa5f5e-d0d1-4a89-90fd-6489c0475121",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -45],
  });

  const activeInGeofenceFleets = actives?.filter(active => {
    const latestLocation = Array.isArray(active.location) && active.location.length > 0
      ? active.location[active.location.length - 1]
      : active.location;
    
    return active.status === "Active" && 
           (!latestLocation?.status || latestLocation.status !== "outside_geofence");
  });

  return (
    <div style={mapContainerStyle}>
      <MapContainer
        center={{
          lat: 14.580695585521143,
          lng: 121.04115726772709,
        }}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {activeInGeofenceFleets?.map((active, index) => {
          const latitude = active.location?.latitude;
          const longitude = active.location?.longitude;

          if (!latitude || !longitude) return null;

          return (
            <Marker
              key={index}
              position={{ lat: latitude, lng: longitude }}
              icon={defaultIcon}
            >
              <Popup>
                <div>
                  <h4>Truck Plate: {active.truckPlate}</h4>
                  <p>Truck Name: {active.truckName}</p>
                  <p>Status: Active</p>
                  <p>Truck Type: {active.truckType}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default ViewFleets;