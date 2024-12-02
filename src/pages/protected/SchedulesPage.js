import { useState } from "react";
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
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Input,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import DropdownMenu from "../../components/DropdownMenu";
import {
  db,
  collection,
  addDoc,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc
} from "../../firebase";

const SchedulesPage = ({ routes, fleets, schedules }) => {
 

  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const [addDay, setAddDay] = useState("Monday");
  const [addTime, setAddTime] = useState(dayjs());
  const [addRouteId, setAddRouteId] = useState(routes[0]?.id || "");
  const [addFleetId, setAddFleetId] = useState(fleets[0]?.id || "");

 // Snackbar state
 const [snackbarOpen, setSnackbarOpen] = useState(false);
 const [snackbarMessage, setSnackbarMessage] = useState("");
 const [snackbarSeverity, setSnackbarSeverity] = useState("success");
 
  const [sortField, setSortField] = useState("day"); // Sorting state
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [editDay, setEditDay] = useState("Monday");
  const [editTime, setEditTime] = useState(dayjs());
  const [editRouteId, setEditRouteId] = useState("");
  const [editFleetId, setEditFleetId] = useState("");


  const [openDialog, setOpenDialog] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  const handleAddDay = (value) => setAddDay(value);
  const handleEditDay = (value) => setEditDay(value);
  const handleAddTime = (newTime) => setAddTime(newTime);
  const handleEditTime = (newTime) => setEditTime(newTime);

  const handleAddRouteId = (id) => setAddRouteId(id);
  const handleEditRouteId = (id) => setEditRouteId(id);

  const handleAddFleetId = (id) => setAddFleetId(id);
  const handleEditFleetId = (id) => setEditFleetId(id);



  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "schedules"), {
        day: addDay,
        time: Timestamp.fromDate(addTime.toDate()),
        routeId: addRouteId,
        fleetId: addFleetId,

      });

      setAddDay("Monday");
      setAddTime(dayjs());
      setAddRouteId(routes[0]?.id || "");
      setAddFleetId(fleets[0]?.id || "");
      setSnackbarMessage("Schedule successfully added!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      console.log("Schedule successfully inserted");
    } catch (error) {
      setSnackbarMessage("Error adding Schedule. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error adding document: ", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedSchedule) return;

    try {
      const docRef = doc(db, "schedules", selectedSchedule.id);
      await updateDoc(docRef, {
        day: editDay,
        time: Timestamp.fromDate(editTime.toDate()),
        routeId: editRouteId,
        fleetId: editFleetId,

      });

      setEditDay("Monday");
      setEditTime(dayjs());
      setEditRouteId(routes[0]?.id || "");
      setEditFleetId(fleets[0]?.id || "");
      setSelectedSchedule(null);
      setIsEditing(false);
      setSnackbarMessage("Schedule successfully updated!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      console.log("Schedule successfully updated");
    } catch (error) {
      setSnackbarMessage("Error updating Schedule. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error updating document: ", error);
    }
  };

  const handleDeleteClick = (e, scheduleId) => {
    e.preventDefault();
    setScheduleToDelete(scheduleId);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!scheduleToDelete) return;

    try {
      const docRef = doc(db, "schedules", scheduleToDelete);
      await deleteDoc(docRef);
      setSnackbarMessage("Schedule successfully deleted!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      console.log("Document successfully deleted!");
      setOpenDialog(false);
    } catch (error) {
      setSnackbarMessage("Error deleting Schedule. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error removing document: ", error);
    }
  };

  const handleEdit = async (e, schedule) => {
    e.preventDefault();

    setSelectedSchedule(schedule);
    setEditDay(schedule.day);
    setEditTime(dayjs(schedule.time.toDate()));
    setEditRouteId(schedule.routeId);
    setEditFleetId(schedule.fleetId);

    setIsEditing(true);
  };

  const handleCancel = async (e) => {
    e.preventDefault();

    setSelectedSchedule(null);
    setEditDay("Monday");
    setEditTime(dayjs());
    setEditRouteId(routes[0]?.id || "");
    setEditFleetId(fleets[0]?.id || "");

    setIsEditing(false);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setScheduleToDelete(null);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  const sortSchedules = (a, b) => {
    const orderMultiplier = sortOrder === "asc" ? 1 : -1;

    switch (sortField) {
      case "day":
        return orderMultiplier * a.day.localeCompare(b.day);
      case "time":
        return orderMultiplier * (a.time.toDate() - b.time.toDate());
      case "route":
        return orderMultiplier * (routes.find((r) => r.id === a.routeId)?.routeName || "").localeCompare(
          routes.find((r) => r.id === b.routeId)?.routeName || ""
        );
      case "fleet":
        return orderMultiplier * (fleets.find((f) => f.id === a.fleetId)?.truckName || "").localeCompare(
          fleets.find((f) => f.id === b.fleetId)?.truckName || ""
        );
      default:
        return 0;
    }
  };

  const filteredSchedules = schedules
    .filter((schedule) => {
      const route = routes.find((r) => r.id === schedule.routeId)?.routeName || "";
      const fleet = fleets.find((f) => f.id === schedule.fleetId)?.truckName || "";
    
      return (
        route.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fleet.toLowerCase().includes(searchQuery.toLowerCase()) 
      );
    })
    .sort(sortSchedules); // Apply sorting here
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
  
  return (
    <div className="schedulespage">
     
 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
     <h2>Schedules</h2>
      <FormControl sx={{ width: "300px" }}>
        <InputLabel>Search</InputLabel>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </FormControl>
   </Box>
      {routes.length === 0 || fleets.length === 0 ? (
        <Typography sx={{ marginTop: "10px" }} variant="h6" color="error">
          Routes and Fleets should have at least one element
        </Typography>
      ) : (
        <>
          {!isEditing && (
            <Box sx={{ display: "flex", marginTop: "10px" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["TimePicker"]}
                  sx={{ marginRight: "20px" }}
                >
                  <TimePicker
                    label="Time"
                    value={addTime}
                    onChange={handleAddTime}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <DropdownMenu
                handleChange={handleAddDay}
                selectedId={addDay}
                options={[
                  { id: "Monday", name: "Monday" },
                  { id: "Tuesday", name: "Tuesday" },
                  { id: "Wednesday", name: "Wednesday" },
                  { id: "Thursday", name: "Thursday" },
                  { id: "Friday", name: "Friday" },
                  { id: "Saturday", name: "Saturday" },
                  { id: "Sunday", name: "Sunday" }
                ]}
                label="Day"
              />
              <DropdownMenu
                handleChange={handleAddRouteId}
                selectedId={addRouteId}
                options={routes.map((route) => ({
                  id: route.id,
                  name: route.routeName
                }))}
                label="Route"
              />
              <DropdownMenu
                handleChange={handleAddFleetId}
                selectedId={addFleetId}
                options={fleets.map((fleet) => ({
                  id: fleet.id,
                  name: fleet.truckName
                }))}
                label="Fleet"
              />
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["TimePicker"]}
                  sx={{ marginRight: "20px" }}
                >
                  <TimePicker
                    label="Time"
                    value={editTime}
                    onChange={handleEditTime}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <DropdownMenu
                handleChange={handleEditDay}
                selectedId={editDay}
                options={[
                  { id: "Monday", name: "Monday" },
                  { id: "Tuesday", name: "Tuesday" },
                  { id: "Wednesday", name: "Wednesday" },
                  { id: "Thursday", name: "Thursday" },
                  { id: "Friday", name: "Friday" },
                  { id: "Saturday", name: "Saturday" },
                  { id: "Sunday", name: "Sunday" }
                ]}
                label="Day"
              />
              <DropdownMenu
                handleChange={handleEditRouteId}
                selectedId={editRouteId}
                options={routes.map((route) => ({
                  id: route.id,
                  name: route.routeName
                }))}
                label="Route"
              />
              <DropdownMenu
                handleChange={handleEditFleetId}
                selectedId={editFleetId}
                options={fleets.map((fleet) => ({
                  id: fleet.id,
                  name: fleet.truckName
                }))}
                label="Fleet"
              />
           <Button
                sx={{
                  width: "300px",
                  marginRight: "20px",
                  backgroundColor: "red",
                }}
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

<TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort("day")} style={{ cursor: "pointer" }}>
                Day {sortField === "day" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell onClick={() => handleSort("time")} style={{ cursor: "pointer" }}>
                Time {sortField === "time" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell onClick={() => handleSort("route")} style={{ cursor: "pointer" }}>
                Route {sortField === "route" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell onClick={() => handleSort("fleet")} style={{ cursor: "pointer" }}>
                Fleet {sortField === "fleet" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSchedules.map((schedule) => {
              const route = routes.find((r) => r.id === schedule.routeId)?.routeName || "";
              const fleet = fleets.find((f) => f.id === schedule.fleetId)?.truckName || "";
              
         
              
              return (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.day}</TableCell>
                  <TableCell>{dayjs(schedule.time.toDate()).format("HH:mm")}</TableCell>
                  <TableCell>{route}</TableCell>
                  <TableCell>{fleet}</TableCell>
                  <TableCell>
                  <Tooltip title="Edit">
                    <IconButton
                      aria-label="edit"
                      onClick={(e) => handleEdit(e, schedule)}
                    >
                      <Edit />
                    </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                    <IconButton color="error"
                      aria-label="delete"
                      onClick={(e) => handleDeleteClick(e, schedule.id)}
                    >
                      <Delete />
                    </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={openDialog}
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Confirm Deletion"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this schedule?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} color="error" variant="contained"autoFocus>
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
        </>
      )}
    </div>
  );
};

export default SchedulesPage;
