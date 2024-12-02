import { useState } from "react";
import {
  Box,
  InputLabel,
  FormControl,
  Input,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormHelperText,  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import {
  db,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "../../firebase";

const FleetsPage = ({ fleets }) => {
  const [addTruckType, setAddTruckType] = useState("");
  const [addTruckName, setAddTruckName] = useState("");
  const [addTruckPlate, setAddTruckPlate] = useState("");

  const [selectedTruck, setSelectedTruck] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTruckType, setEditTruckType] = useState("");
  const [editTruckName, setEditTruckName] = useState("");
  const [editTruckPlate, setEditTruckPlate] = useState("");

  const [openDialog, setOpenDialog] = useState(false); // For delete confirmation dialog
  const [TruckToDelete, setTruckToDelete] = useState(null);
  // Error states for validation
  const [errorTruckType, setErrorTruckType] = useState(false);
  const [errorTruckName, setErrorTruckName] = useState(false);
  const [errorTruckPlate, setErrorTruckPlate] = useState(false);
 // Snackbar state
 const [snackbarOpen, setSnackbarOpen] = useState(false);
 const [snackbarMessage, setSnackbarMessage] = useState("");
 const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Validation function
  const validateInputs = () => {
    let isValid = true;

    if (!addTruckType) {
      setErrorTruckType(true);
      isValid = false;
    } else {
      setErrorTruckType(false);
    }

    if (!addTruckName) {
      setErrorTruckName(true);
      isValid = false;
    } else {
      setErrorTruckName(false);
    }

    if (!addTruckPlate ) {
      setErrorTruckPlate(true);
      isValid = false;
    } else {
      setErrorTruckPlate(false);
    }

    return isValid;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return; // Stop if validation fails
    }

    try {
      await addDoc(collection(db, "fleets"), {
        truckType: addTruckType,
        truckName: addTruckName,
        truckPlate: addTruckPlate,
        status: "Inactive",
        location: {},
      });

      setAddTruckType("");
      setAddTruckName("");
      setAddTruckPlate("");
      setSnackbarMessage("Fleet successfully added!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      console.log("Fleet successfully inserted");
    } catch (error) {
      setSnackbarMessage("Error adding fleet. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error adding document: ", error);
    }
  };


  const handleEdit = async (e, fleet) => {
    e.preventDefault();

    setSelectedTruck(fleet);
    setEditTruckType(fleet.truckType);
    setEditTruckName(fleet.truckName);
    setEditTruckPlate(fleet.truckPlate);
    setIsEditing(true);
  };

  const handleDeleteClick = (e, truckId) => {
    e.preventDefault();
    setTruckToDelete(truckId);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!TruckToDelete) return;
    try {
      const docRef = doc(db, "fleets", TruckToDelete);
      await deleteDoc(docRef);

      console.log("Document successfully deleted!");
      setOpenDialog(false); // Close the dialog after deleting
      setSnackbarMessage("Fleet successfully deleted!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Error deleting fleet. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error removing document: ", error);
    }
  };


  const handleCancel = async (e) => {
    e.preventDefault();

    setAddTruckType("");
    setAddTruckName("");
    setAddTruckPlate("");
    setSelectedTruck(null);
    setIsEditing(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const docRef = doc(db, "fleets", selectedTruck.id);
      await updateDoc(docRef, {
        truckType: editTruckType,
        truckName: editTruckName,
        truckPlate: editTruckPlate,
        status: selectedTruck.status,
        location: selectedTruck.location,
      });

      setEditTruckType("");
      setEditTruckName("");
      setEditTruckPlate("");
      setSelectedTruck(null);
      setIsEditing(false);
      setSnackbarMessage("Fleet successfully updated!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      console.log("Fleet successfully updated");
    } catch (error) {
      setSnackbarMessage("Error updating fleet. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error updating document: ", error);
    }
  };
  const handleDialogClose = () => {
    setOpenDialog(false); // Close the dialog without deleting
    setTruckToDelete(null); // Clear the schedule to delete
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <div className="fleetspage">
      <h2>Fleets</h2>
      {!isEditing && (
        <Box sx={{ display: "flex", marginTop: "10px" }}>
          <FormControl fullWidth sx={{ marginRight: "20px" }} error={errorTruckType}>
            <InputLabel>Truck Type</InputLabel>
            <Input
              type="text"
              value={addTruckType}
              onChange={(e) => setAddTruckType(e.target.value)}
            />
            {errorTruckType && <FormHelperText>Truck Type is required.</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ marginRight: "20px" }} error={errorTruckName}>
            <InputLabel>Truck Name</InputLabel>
            <Input
              type="text"
              value={addTruckName}
              onChange={(e) => setAddTruckName(e.target.value)}
            />
            {errorTruckName && <FormHelperText>Truck Name is required.</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ marginRight: "20px" }} error={errorTruckPlate}>
            <InputLabel>Truck Plate</InputLabel>
            <Input
              type="text"
              value={addTruckPlate}
              onChange={(e) => setAddTruckPlate(e.target.value)}
            />
            {errorTruckPlate && <FormHelperText>Invalid Truck Plate. Only letters and numbers are allowed.</FormHelperText>}
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
            <InputLabel>Truck Type</InputLabel>
            <Input
              type="text"
              value={editTruckType}
              onChange={(e) => setEditTruckType(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginRight: "20px" }}>
            <InputLabel>Truck Name</InputLabel>
            <Input
              type="text"
              value={editTruckName}
              onChange={(e) => setEditTruckName(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginRight: "20px" }}>
            <InputLabel>Truck Plate</InputLabel>
            <Input
              type="text"
              value={editTruckPlate}
              onChange={(e) => setEditTruckPlate(e.target.value)}
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
              <TableCell align="start">Truck Type</TableCell>
              <TableCell align="start">Truck Name</TableCell>
              <TableCell align="start">Truck Plate</TableCell>
              <TableCell align="start">Status</TableCell>
              <TableCell align="start">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fleets.map((fleet) => (
              <TableRow key={fleet.id}>
                <TableCell align="start">{fleet.truckType}</TableCell>
                <TableCell align="start">{fleet.truckName}</TableCell>
                <TableCell align="start">{fleet.truckPlate}</TableCell>
                <TableCell align="start">{fleet.status}</TableCell>
                <TableCell align="start">
                <Tooltip title="Edit">
                  <IconButton onClick={(e) => handleEdit(e, fleet)}>
                    <Edit />
                  </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                  <IconButton                         color="error"onClick={(e) => handleDeleteClick(e, fleet.id)}>
                    <Delete />
                  </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
      >
<DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this fleet?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FleetsPage;
