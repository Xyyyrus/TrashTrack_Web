// import { useState, useEffect, useCallback } from "react";
// import {
//   GoogleMap,
//   useJsApiLoader,
//   Marker, // Importing Marker to use for the first click
//   DirectionsRenderer,
// } from "@react-google-maps/api";
// import { Button } from "@mui/material";

// const mapContainerStyle = {
//   height: "100vh",
//   width: "100%",
//   position: "relative",
// };

// const buttonContainerStyle = {
//   position: "absolute",
//   bottom: "20px",
//   left: "50%",
//   transform: "translateX(-50%)",
//   display: "flex",
//   gap: "10px",
//   zIndex: 1,
// };

// const CreateRoute = ({ handleSave, handleClose }) => {
//   const [path, setPath] = useState([]);
//   const [collections, setCollections] = useState([]); // Collection points, starting with "B"
//   const [directionsResponse, setDirectionsResponse] = useState(null);
//   const [mapCenter, setMapCenter] = useState({
//     lat: 14.580695585521143,
//     lng: 121.04115726772709,
//   });
//   const [markerAdded, setMarkerAdded] = useState(false); // Track if the first marker is added
//   const [firstMarker, setFirstMarker] = useState(null); // Store the first marker's position

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "AIzaSyC7Ssud77ds2HFTI5a9fJfAcfEUAL52r90",
//     libraries: ["places"],
//   });

//   useEffect(() => {
//     if (path.length > 1) {
//       const directionsService = new window.google.maps.DirectionsService();
//       const waypoints = path.slice(1, -1).map((point) => ({
//         location: new window.google.maps.LatLng(point.lat, point.lng),
//         stopover: true,
//       }));

//       directionsService.route(
//         {
//           origin: path[0],
//           destination: path[path.length - 1],
//           waypoints: waypoints,
//           travelMode: window.google.maps.TravelMode.DRIVING,
//         },
//         (result, status) => {
//           if (status === window.google.maps.DirectionsStatus.OK) {
//             setDirectionsResponse(result);
//           } else {
//             console.error("Error fetching directions", result);
//           }
//         }
//       );
//     }
//   }, [path]);

//   const handleMapClick = useCallback(
//     async (event) => {
//       const { latLng } = event;
//       const lat = latLng.lat();
//       const lng = latLng.lng();

//       if (!markerAdded) {
//         // Add marker on first click
//         setMarkerAdded(true);
//         setFirstMarker({ lat, lng }); // Store the position of the first marker

//         const geocoder = new window.google.maps.Geocoder();
//         const latLngForGeocode = new window.google.maps.LatLng(lat, lng);

//         try {
//           const response = await geocoder.geocode({ location: latLngForGeocode });

//           if (response.results.length > 0) {
//             const addressComponents = response.results[0].address_components;
//             const municipalityComponent = addressComponents.find((component) =>
//               component.types.includes("locality")
//             );
//             if (municipalityComponent) {
//               if (municipalityComponent.long_name === "Mandaluyong") {
//                 // Update path and collections
//                 setPath((prevPath) => [...prevPath, { lat, lng }]);
//                 setCollections([{ letter: "B", lat, lng }]); // First collection point is always "B"

//                 // Update map center to the new point
//                 setMapCenter({ lat, lng });
//               }
//             } else {
//               console.error("Geocoding error: Municipality not found");
//             }
//           } else {
//             console.error("Geocoding error: No results found");
//           }
//         } catch (error) {
//           console.error("Geocoding error:", error);
//         }
//       } else {
//         // No marker for subsequent clicks, just update the path and map center
//         setPath((prevPath) => [...prevPath, { lat, lng }]);
//         setCollections((prevCollections) => [
//           ...prevCollections,
//           { letter: String.fromCharCode(66 + prevCollections.length), lat, lng }, // Automatically assign next letter in sequence
//         ]);
//         setMapCenter({ lat, lng });
//       }
//     },
//     [markerAdded]
//   );

//   const undoLastPoint = useCallback(() => {
//     if (path.length > 0) {
//       setPath((prevPath) => prevPath.slice(0, -1));
//     }

//     if (collections.length > 0) {
//       setCollections((prevCollections) => prevCollections.slice(0, -1));
//     }
//   }, [path, collections]);

//   const handleKeyDown = useCallback(
//     (event) => {
//       if (event.ctrlKey && event.key === "z") {
//         undoLastPoint();
//       }
//     },
//     [undoLastPoint]
//   );

//   useEffect(() => {
//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [handleKeyDown]);

//   return isLoaded ? (
//     <div style={mapContainerStyle}>
//       <GoogleMap
//         mapContainerStyle={{ height: "100%", width: "100%" }}
//         zoom={14}
//         center={mapCenter} // Dynamic center updates based on user interaction
//         onClick={handleMapClick}
//       >
//         {/* Only render the first marker */}
//         {firstMarker && <Marker position={firstMarker} />}

//         {directionsResponse && path.length > 1 && (
//           <DirectionsRenderer directions={directionsResponse} />
//         )}
//       </GoogleMap>
//       <div style={buttonContainerStyle}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => handleSave(directionsResponse, collections)}
//         >
//           Save
//         </Button>
//         <Button variant="contained" color="secondary" onClick={handleClose}>
//           Close
//         </Button>
//       </div>
//     </div>
//   ) : (
//     <div>Loading...</div>
//   );
// };

// export default CreateRoute;



import { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { Button } from "@mui/material";
import { useNonce } from "../context/NonceContext"; // Add this import

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
  zIndex: 1,
};

const CreateRoute = ({ handleSave, handleClose }) => {
  const nonce = useNonce(); // Get the nonce
  const [path, setPath] = useState([]);
  const [collections, setCollections] = useState([]);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [firstMarker, setFirstMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 14.580695585521143,
    lng: 121.04115726772709,
  });
  const [markerAdded, setMarkerAdded] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
    nonce: nonce, // Add nonce to script loader
    
  });

  useEffect(() => {
    if (path.length > 1) {
      const directionsService = new window.google.maps.DirectionsService();
      const waypoints = path.slice(1, -1).map((point) => ({
        location: new window.google.maps.LatLng(point.lat, point.lng),
        stopover: true,
      }));

      directionsService.route(
        {
          origin: path[0],
          destination: path[path.length - 1],
          waypoints: waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            console.error("Error fetching directions", result);
          }
        }
      );
    }
  }, [path]);

  const handleMapClick = useCallback(
    async (event) => {
      const { latLng } = event;
      const lat = latLng.lat();
      const lng = latLng.lng();

      const geocoder = new window.google.maps.Geocoder();
      const latLngForGeocode = new window.google.maps.LatLng(lat, lng);

      try {
        const response = await geocoder.geocode({ location: latLngForGeocode });

        if (response.results.length > 0) {
          const addressComponents = response.results[0].address_components;
          const municipalityComponent = addressComponents.find((component) =>
            component.types.includes("locality")
          );
          if (municipalityComponent) {
            if (municipalityComponent.long_name === "Mandaluyong") {
              // First click adds marker
              if (!markerAdded) {
                setFirstMarker({ lat, lng });
                setMarkerAdded(true);
              }

              // On subsequent clicks
              setPath((prevPath) => [...prevPath, { lat, lng }]);
              setMapCenter({ lat, lng });

              // After first click, don't add a marker but remove the previous one
              if (path.length > 0) {
                setFirstMarker(null); // Remove the first marker
                setCollections((prevCollections) => [
                  ...prevCollections,
                  { lat, lng },
                ]);
              }
            }
          } else {
            console.error("Geocoding error: Municipality not found");
          }
        } else {
          console.error("Geocoding error: No results found");
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    },
    [path, markerAdded]
  );

  const undoLastPoint = useCallback(() => {
    if (path.length > 0) {
      setPath((prevPath) => prevPath.slice(0, -1));
    }

    if (collections.length > 0) {
      setCollections((prevCollections) => prevCollections.slice(0, -1));
    }
  }, [path, collections]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.ctrlKey && event.key === "z") {
        undoLastPoint();
      }
    },
    [undoLastPoint]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return isLoaded ? (
    <div style={mapContainerStyle}>
      <GoogleMap
        mapContainerStyle={{ height: "100%", width: "100%" }}
        zoom={14}
        center={mapCenter}
        onClick={handleMapClick}
        nonce={nonce} // Add nonce to GoogleMap component
      >
        {firstMarker && <Marker position={firstMarker} />}
        {directionsResponse && path.length > 1 && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
      <div style={buttonContainerStyle}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSave(directionsResponse, collections)}
        >
          Save
        </Button>
        <Button variant="contained" color="secondary" onClick={handleClose}>
          Close
        </Button>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default CreateRoute;















//OLD MAP BROKEN DUE TO RENDER, AFFECTED BY SECURITY HEADERS
// import { useState, useEffect, useCallback } from "react";
// import {
//   GoogleMap,
//   useJsApiLoader,
//   Marker,
//   DirectionsRenderer,
// } from "@react-google-maps/api";
// import { Button } from "@mui/material";

// const mapContainerStyle = {
//   height: "100vh",
//   width: "100%",
//   position: "relative",
// };

// const buttonContainerStyle = {
//   position: "absolute",
//   bottom: "20px",
//   left: "50%",
//   transform: "translateX(-50%)",
//   display: "flex",
//   gap: "10px",
//   zIndex: 1,
// };

// const CreateRoute = ({ handleSave, handleClose }) => {
//   const [path, setPath] = useState([]);
//   const [collections, setCollections] = useState([]);
//   const [directionsResponse, setDirectionsResponse] = useState(null);
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "AIzaSyC7Ssud77ds2HFTI5a9fJfAcfEUAL52r90",
//     libraries: ["places"],
//   });
//   const [isMarked, setIsMarked] = useState(true);

//   useEffect(() => {
//     if (path.length > 1) {
//       const directionsService = new window.google.maps.DirectionsService();
//       const waypoints = path.slice(1, -1).map((point) => ({
//         location: new window.google.maps.LatLng(point.lat, point.lng),
//         stopover: true,
//       }));

//       if (isMarked) {
//         setIsMarked(false);
//       }

//       directionsService.route(
//         {
//           origin: path[0],
//           destination: path[path.length - 1],
//           waypoints: waypoints,
//           travelMode: window.google.maps.TravelMode.DRIVING,
//         },
//         (result, status) => {
//           if (status === window.google.maps.DirectionsStatus.OK) {
//             setDirectionsResponse(result);
//           } else {
//             console.error("Error fetching directions", result);
//           }
//         }
//       );
//     }
//   }, [path, isMarked]);

//   const handleMapClick = useCallback(
//     async (event) => {
//       const { latLng } = event;
//       const lat = latLng.lat();
//       const lng = latLng.lng();

//       const geocoder = new window.google.maps.Geocoder();
//       const latLngForGeocode = new window.google.maps.LatLng(lat, lng);

//       try {
//         const response = await geocoder.geocode({ location: latLngForGeocode });

//         if (response.results.length > 0) {
//           const addressComponents = response.results[0].address_components;
//           const municipalityComponent = addressComponents.find((component) =>
//             component.types.includes("locality")
//           );
//           if (municipalityComponent) {
//             if (municipalityComponent.long_name === "Mandaluyong") {
//               setPath((prevPath) => [...prevPath, { lat, lng }]);

//               if (path.length > 0) {
//                 setCollections((prevCollections) => [
//                   ...prevCollections,
//                   { lat, lng },
//                 ]);
//               }
//             }
//           } else {
//             console.error("Geocoding error: Municipality not found");
//           }
//         } else {
//           console.error("Geocoding error: No results found");
//         }
//       } catch (error) {
//         console.error("Geocoding error:", error);
//       }
//     },
//     [path]
//   );

//   const undoLastPoint = useCallback(() => {
//     if (path.length > 0) {
//       setPath((prevPath) => prevPath.slice(0, -1));
//     }

//     if (collections.length > 0) {
//       setPath((prevCollections) => prevCollections.slice(0, -1));
//     }
//   }, [path, collections]);

//   const handleKeyDown = useCallback(
//     (event) => {
//       if (event.ctrlKey && event.key === "z") {
//         undoLastPoint();
//       }
//     },
//     [undoLastPoint]
//   );

//   useEffect(() => {
//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [handleKeyDown]);

//   return isLoaded ? (
//     <div style={mapContainerStyle}>
//       <GoogleMap
//         mapContainerStyle={{ height: "100%", width: "100%" }}
//         zoom={14}
//         center={{
//           lat: 14.580695585521143,
//           lng: 121.04115726772709,
//         }}
//         onClick={handleMapClick}
//       >
//         {isMarked &&
//           path.map((position, index) => (
//             <Marker key={index} position={position} />
//           ))}
//         {directionsResponse && path.length > 1 && (
//           <DirectionsRenderer directions={directionsResponse} />
//         )}
//       </GoogleMap>
//       <div style={buttonContainerStyle}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => handleSave(directionsResponse, collections)}
//         >
//           Save
//         </Button>
//         <Button variant="contained" color="secondary" onClick={handleClose}>
//           Close
//         </Button>
//       </div>
//     </div>
//   ) : (
//     <div>Loading...</div>
//   );
// };

// export default CreateRoute;
