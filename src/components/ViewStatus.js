import React from 'react';
import Typography from "@mui/material/Typography";

const containerStyle = {
  height: "80vh",
  width: "100%",
  position: "relative",
};

const ViewStatus = ({ actives, schedules, routes }) => {
  const activeInGeofence = actives?.filter(active => {
    const latestLocation = Array.isArray(active.location) && active.location.length > 0
      ? active.location[active.location.length - 1]
      : active.location;
    
    return active.status === "Active" && 
           (!latestLocation?.status || latestLocation.status !== "outside_geofence");
  });

  return activeInGeofence && activeInGeofence.length > 0 ? (
    <div style={containerStyle}>
      {activeInGeofence.map((active, index) => {
        const schedule = schedules.find((s) => s.fleetId === active.id);
        const route = routes.find((r) => r.id === schedule?.routeId);
      
        return (
          <Typography
            key={index}
            sx={{ 
              marginBottom: "10px", 
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              padding: "8px",
              backgroundColor: "rgba(0, 255, 0, 0.05)",
              borderRadius: "4px",
            }}
            variant="h7"
            gutterBottom
          >
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              width: "100%",
            }}>
              <span style={{ fontWeight: "medium" }}>
                {active.truckPlate} - {route?.routeName || 'No Route Assigned'}
              </span>
            </div>
          </Typography>
        );
      })}
    </div>
  ) : (
    <div>No active trucks within the area</div>
  );
};

export default ViewStatus;