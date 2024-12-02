import React from 'react';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ViewStatus Component
const ViewStatus = ({ actives, schedules, routes, nonce }) => {
  if (!actives?.length) return <div>No active trucks</div>;

  const getStatusColor = (status) => {
    switch (status) {
      case 'outside_geofence':
        return 'error';
      case 'Active':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'outside_geofence':
        return 'OUTSIDE GEOFENCE';
      case 'Active':
        return 'ON DUTY';
      case 'collecting':
        return 'COLLECTING';
      default:
        return status?.toUpperCase() || 'UNKNOWN';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'outside_geofence':
        return <ErrorIcon />;
      case 'Active':
        return <CheckCircleIcon />;
      case 'collecting':
      case 'en_route':
        return <LocalShippingIcon />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        height: "80vh",
        overflowY: "auto",
        padding: "16px",
        backgroundColor: "background.paper",
        borderRadius: 1,
        boxShadow: 1
      }}
    >
      {actives.map((active, index) => {
        const schedule = schedules.find((s) => s.fleetId === active.id);
        const route = routes.find((r) => r.id === schedule?.routeId);
        const latestLocation = Array.isArray(active.location) && active.location.length > 0
          ? active.location[active.location.length - 1]
          : active.location;
        const isOutsideGeofence = active.status === "outside_geofence" || latestLocation?.status === "outside_geofence";
        const currentStatus = isOutsideGeofence ? 'outside_geofence' : active.status;
        const statusColor = getStatusColor(currentStatus);

        return (
          <Box
            key={index}
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 1,
              backgroundColor: isOutsideGeofence ? "error.light" : "background.default",
              border: 1,
              borderColor: `${statusColor}.main`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 2
              }
            }}
          >
            {/* Header with Truck Info */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "medium",
                  color: isOutsideGeofence ? "error.dark" : "text.primary",
                  flex: 1
                }}
              >
                {active.truckPlate}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: `${statusColor}.main`,
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  gap: 0.5
                }}
              >
                {getStatusIcon(currentStatus)}
                <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                  {getStatusLabel(currentStatus)}
                </Typography>
              </Box>
            </Box>

            {/* Route Information */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocalShippingIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '1rem' }} />
              <Typography variant="body2" color="text.secondary">
                Route: {route?.routeName || 'No Route Assigned'}
              </Typography>
            </Box>

            {/* Location Information */}
            {(isOutsideGeofence && latestLocation?.address) && (
              <Box sx={{ display: "flex", alignItems: "flex-start", mt: 1 }}>
                <LocationOnIcon sx={{ mr: 1, color: 'error.main', fontSize: '1rem', mt: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  Current location: {latestLocation.address}
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

const ViewFleets = ({ actives, nonce }) => {
  const defaultIcon = new L.Icon({
    iconUrl: "https://firebasestorage.googleapis.com/v0/b/trashtrack-ac6eb.appspot.com/o/website_assets%2Fgarbage-pin.png?alt=media&token=b3fa5f5e-d0d1-4a89-90fd-6489c0475121",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -45],
  });

  const mapCenter = {
    lat: 14.580695585521143,
    lng: 121.04115726772709,
  };
  const insideGeofenceFleets = actives?.filter(
    (active) => active.status !== "outside_geofence" &&
    (!active.location?.status || active.location?.status !== "outside_geofence")
  );

  return (
    <Box sx={{ height: "80vh", width: "100%", position: "relative" }}>
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: "100%", width: "100%", borderRadius: "8px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {insideGeofenceFleets?.map((active, index) => {
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
                <Box sx={{ p: 1 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {active.truckPlate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Name: {active.truckName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="success.main"
                    sx={{ fontWeight: "bold" }}
                  >
                    Status: Within Geofence
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {active.truckType}
                  </Typography>
                </Box>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </Box>
  );
};

// DashboardPage Component
const DashboardPage = ({ uinfo, fleets, schedules, routes, nonce }) => {
  const actives = fleets.filter((fleet) => fleet.status === "Active");

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Dashboard
          </Typography>
        </Grid>
        <Grid item xs={4}>
          {uinfo ? (
            <Typography variant="h5">
              {`${uinfo.firstname} ${uinfo.lastname} - ${uinfo.role}`}
            </Typography>
          ) : (
            <Typography variant="h5">Loading...</Typography>
          )}
        </Grid>
        <Grid item xs={8}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Deployed Fleets
          </Typography>
          <ViewFleets actives={actives} nonce={nonce} />
        </Grid>
        <Grid item xs={4}>
          <ViewStatus actives={actives} schedules={schedules} routes={routes} nonce={nonce} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
