import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Input,
  InputLabel,
  InputAdornment,
  FormControl,
  FormHelperText,
  Tooltip,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide, 
  Snackbar,
   Alert,
} from "@mui/material";
import { useState, forwardRef } from "react";
import {
  db,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "../../firebase";
import { Delete, Edit, Map, Visibility } from "@mui/icons-material";
import CreateRoute from "../../components/CreateRoute";
import ViewRoute from "../../components/ViewRoute";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RoutesPage = ({ routes }) => {
  const [addRouteName, setAddRouteName] = useState("");
  const [addRouteCoords, setAddRouteCoords] = useState("");
  const [addCreateDialogOpen, setAddCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addDirectionsResponse, setAddDirectionsResponse] = useState(null);
  const [addAllCollections, setAddAllCollections] = useState([]);
  const [editAllCollections, setEditAllCollections] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedCollections, setSelectedCollections] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [editRouteName, setEditRouteName] = useState(null);
  const [editRouteCoords, setEditRouteCoords] = useState("");
  const [editCreateDialogOpen, setEditCreateDialogOpen] = useState(false);
  const [editDirectionsResponse, setEditDirectionsResponse] = useState(null);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorRouteName, setErrorRouteName] = useState(false);
  const [errorRouteCoords,] = useState(false);
    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleAddCreateOpen = () => {
    setAddCreateDialogOpen(true);
  };

  const handleEditCreateOpen = () => {
    setEditCreateDialogOpen(true);
  };

  const handleAddCreateClose = () => {
    setAddCreateDialogOpen(false);
  };

  const handleEditCreateClose = () => {
    setEditCreateDialogOpen(false);
  };

  const handleViewOpen = () => {
    setViewDialogOpen(true);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
  };

  const handleAddSave = (addDirectionsResponse, addAllCollections) => {
    setAddDirectionsResponse(addDirectionsResponse);
    setAddAllCollections(addAllCollections);
    setAddRouteCoords("Route Generated");
    handleAddCreateClose();
  };

  const handleEditSave = (editDirectionsResponse, editAllCollections) => {
    setEditDirectionsResponse(editDirectionsResponse);
    setEditAllCollections(editAllCollections);
    setEditRouteCoords("Route Generated");
    handleEditCreateClose();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
   setErrorRouteName(!addRouteName);
   if (!addRouteName) return;
    try {
      const routes = addDirectionsResponse.routes[0];

      const allPath = routes.overview_path.map((latLng) => ({
        lat: latLng.lat(),
        lng: latLng.lng(),
      }));
      const totalDuration = routes.legs
        .map((leg) => leg.duration.text)
        .join(" + ");
      const totalDistance = routes.legs
        .map((leg) => leg.distance.text)
        .join(" + ");

      const newAddCollections = addAllCollections.slice(0, -1);

      await addDoc(collection(db, "routes"), {
        routeName: addRouteName,
        path: allPath,
        collections: newAddCollections,
        duration: totalDuration,
        distance: totalDistance,
      });

      setAddRouteName("");
      setAddRouteCoords("");
      setAddDirectionsResponse(null);
      setAddAllCollections([]);
      setSnackbarMessage("Route successfully added!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      console.log("Route successfully inserted");
    } catch (error) {
      setSnackbarMessage("Error adding route. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error adding route: ", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  setErrorRouteName(!editRouteName);
    if (!editRouteName) return;
    try {
      if (editDirectionsResponse) {
        const routes = editDirectionsResponse.routes[0];

        const allPath = routes.overview_path.map((latLng) => ({
          lat: latLng.lat(),
          lng: latLng.lng(),
        }));
        const totalDuration = routes.legs
          .map((leg) => leg.duration.text)
          .join(" + ");
        const totalDistance = routes.legs
          .map((leg) => leg.distance.text)
          .join(" + ");

        setEditAllCollections((prevCollections) =>
          prevCollections.slice(0, -1)
        );

        const newEditCollections = editAllCollections.slice(0, -1);

        const docRef = doc(db, "routes", selectedRoute.id);
        await updateDoc(docRef, {
          routeName: editRouteName,
          path: allPath,
          collections: newEditCollections,
          duration: totalDuration,
          distance: totalDistance,
        });
      } else {
        const docRef = doc(db, "routes", selectedRoute.id);
        await updateDoc(docRef, {
          routeName: editRouteName,
        });
      }

      setSelectedRoute(null);
      setEditRouteName("");
      setEditRouteCoords("");
      setEditDirectionsResponse(null);
      setEditAllCollections([]);
      setIsEditing(false);
      setSnackbarMessage("Route successfully updated!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      console.log("Route successfully updated");
    } catch (error) {
      setSnackbarMessage("Error updating Route. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error updating route: ", error);
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    setSelectedRoute(null);
    setEditRouteName("");
    setEditRouteCoords("");
    setEditDirectionsResponse(null);
    setEditAllCollections([]);
    setIsEditing(false);
  };

  const handleView = async (path, collections) => {
    setSelectedPath(path);
    setSelectedCollections(collections);
    handleViewOpen();
  };

  const handleEdit = async (e, route) => {
    e.preventDefault();
    setIsEditing(true);
    setSelectedRoute(route);
    setEditRouteName(route.routeName);
  };

  const handleDelete = (e, docId) => {
    e.preventDefault();
    setSelectedRouteId(docId);
    setConfirmDeleteDialogOpen(true);
  };
  const confirmDelete = async (e, docId) => {
 
    try {
      await deleteDoc(doc(db, "routes", selectedRouteId));
      console.log("Route successfully deleted!");
      setConfirmDeleteDialogOpen(false);
      setSelectedRouteId(null);
      setSnackbarMessage("Route successfully deleted!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Error deleting Route. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error removing route: ", error);
    }
  };
  const filteredRoutes = routes.filter((route) =>
    route.routeName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  return (
    <div className="routespage">
    
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h2>Routes</h2>
      <FormControl sx={{ width: "300px" }}>
          <InputLabel>Search Route</InputLabel>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </FormControl>
      </Box>
      {!isEditing && (
        <Box sx={{ display: "flex", marginTop: "10px" }}>
          <FormControl fullWidth sx={{ marginRight: "20px" }}>
            <InputLabel>Route Name</InputLabel>
            <Input
              type="text"
              value={addRouteName}
              onChange={(e) => setAddRouteName(e.target.value)}
            />
             {errorRouteName && <FormHelperText>Route Name is required.</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ marginRight: "20px" }}>
  <InputLabel>Route Coordinates</InputLabel>
  <Input
    type="text"
    value={addRouteCoords}
    disabled
    endAdornment={
      <InputAdornment position="end">
        <IconButton onClick={handleAddCreateOpen}>
          <Map />
        </IconButton>
        <Typography variant="body2" sx={{ marginLeft: "8px" }} color={"black"}>Open Map</Typography>
      </InputAdornment>
    }
  />
  {errorRouteCoords && <FormHelperText>Route Coordinates are required.</FormHelperText>}
</FormControl>

          <Button
            sx={{ width: "300px" }}
            variant="contained"
            onClick={handleAdd}
          >
            Add
          </Button>
        </Box>
      )}
      {isEditing && (
        <Box sx={{ display: "flex", marginTop: "10px" }}>
          <FormControl fullWidth sx={{ marginRight: "20px" }}>
            <InputLabel>Route Name</InputLabel>
            <Input
              type="text"
              value={editRouteName}
              onChange={(e) => setEditRouteName(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginRight: "20px" }}>
            <InputLabel>Route Coordinates</InputLabel>
            <Input
              type="text"
              value={editRouteCoords}
              disabled={true}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={handleEditCreateOpen}>
                    <Map />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Button
            sx={{ width: "300px", marginRight: "20px", backgroundColor: "red" }}
            variant="contained"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            sx={{ width: "300px" }}
            variant="contained"
            onClick={handleUpdate}
          >
            Update
          </Button>
        </Box>
      )}
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="start">Route Name</TableCell>
              <TableCell align="start">Duration</TableCell>
              <TableCell align="start">Distance</TableCell>
              <TableCell align="start">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {filteredRoutes.map((route) => (
    <TableRow key={route.id}>
      <TableCell align="start">{route.routeName}</TableCell>
      <TableCell align="start">{route.duration}</TableCell>
      <TableCell align="start">{route.distance}</TableCell>
      <TableCell align="start">
        <Tooltip title="View">
          <IconButton onClick={() => handleView(route.path, route.collections)}>
            <Visibility />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton onClick={(e) => handleEdit(e, route)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={(e) => handleDelete(e, route.id)}>
            <Delete />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>
      <Dialog open={confirmDeleteDialogOpen} onClose={() => setConfirmDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this route?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen
        open={addCreateDialogOpen}
        onClose={handleAddCreateClose}
        TransitionComponent={Transition}
      >
        <CreateRoute
          handleSave={handleAddSave}
          handleClose={handleAddCreateClose}
        />
      </Dialog>
      <Dialog
        fullScreen
        open={editCreateDialogOpen}
        onClose={handleEditCreateClose}
        TransitionComponent={Transition}
      >
        <CreateRoute
          handleSave={handleEditSave}
          handleClose={handleEditCreateClose}
        />
      </Dialog>
      <Dialog
        fullScreen
        open={viewDialogOpen}
        onClose={handleViewClose}
        TransitionComponent={Transition}
      >
        <ViewRoute
          path={selectedPath}
          collections={selectedCollections}
          handleClose={handleViewClose}
        />
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RoutesPage;
