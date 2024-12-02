import {
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useState } from "react";
import dayjs from "dayjs";
import {
  db,
  collection,
  addDoc,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc,
} from "../../firebase";
import { BarChart } from "@mui/x-charts/BarChart";
import { Delete, Edit } from "@mui/icons-material";

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day >= 1 ? day - 1 : 6) + 1;
  d.setDate(d.getDate() - diff);
  return new Date(d.setHours(0, 0, 0, 0));
}

function getEndOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day >= 1 ? 7 - day : 0) + 1;
  d.setDate(d.getDate() + diff);
  return new Date(d.setHours(23, 59, 59, 999));
}

function formatDataForChart(items, view) {
  const groupedData = items.reduce((acc, item) => {
    const date = new dayjs(item.date.toDate());
    let key;

    switch (view) {
      case "weekly":
        key = `${
          getStartOfWeek(date.toDate()).toISOString().split("T")[0]
        } to ${getEndOfWeek(date.toDate()).toISOString().split("T")[0]}`;
        break;
      case "monthly":
        key = `${date.format("YYYY-MM")}`;
        break;
      case "yearly":
        key = `${date.format("YYYY")}`;
        break;
      default:
        key = date.format("YYYY-MM-DD");
    }

    if (!acc[key]) {
      acc[key] = { kilograms: 0, cubicMeters: 0 };
    }
    acc[key].kilograms += parseFloat(item.kiloGram);
    acc[key].cubicMeters += parseFloat(item.cubicMeter);
    return acc;
  }, {});

  const keys = Object.keys(groupedData).sort(
    (a, b) => new Date(a) - new Date(b)
  );
  const data = keys.map((key) => groupedData[key]);

  const dates = keys;
  const kilogramsData = data.map((d) => d.kilograms);
  const cubicMetersData = data.map((d) => d.cubicMeters);

  return {
    dates,
    kilogramsData,
    cubicMetersData,
  };
}

const AnalysisPage = ({ analysis }) => {
  const [addDate, setAddDate] = useState(dayjs());
  const [inputKg, setInputKg] = useState("");
  const [cubicMeter, setCubicMeter] = useState("");
  const [view, setView] = useState("daily");

  const [isEditing, setIsEditing] = useState(false);
  const [selectedAnalys, setSelectedAnalys] = useState(null);
  const [editDate, setEditDate] = useState(dayjs());
  const [editInputKg, setEditInputKg] = useState("");
  const [editCubicMeter, setEditCubicMeter] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  const [inputError, setInputError] = useState("");
  const [editError, setEditError] = useState("");

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const setKgCubic = (value) => {
    setInputKg(value);
    const floatKg = parseFloat(value);
    const floatCubic = floatKg / 214.56;
    setCubicMeter(floatCubic.toFixed(2));
  };

  const setEditKgCubic = (value) => {
    setEditInputKg(value);
    const floatKg = parseFloat(value);
    const floatCubic = floatKg / 214.56;
    setEditCubicMeter(floatCubic.toFixed(2));
  };

  const handleAddDate = (newDate) => {
    setAddDate(newDate);
  };

  const handleEditDate = (newDate) => {
    setEditDate(newDate);
  };

  const validateInput = (kg) => {
    const isNumber = !isNaN(kg) && parseFloat(kg) > 0;
    if (!isNumber) {
      setInputError("Input KG must be a positive number");
      return false;
    }
    setInputError("");
    return true;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validateInput(inputKg)) return;

    try {
      await addDoc(collection(db, "analysis"), {
        date: Timestamp.fromDate(addDate.toDate()),
        kiloGram: inputKg,
        cubicMeter: cubicMeter,
      });
      setAddDate(dayjs());
      setInputKg("");
      setCubicMeter("");
      setSnackbarMessage("Data successfully added");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding document: ", error);
      setSnackbarMessage("Error adding data");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  const handleDelete = async () => {
    try {
      const docRef = doc(db, "analysis", docToDelete);
      await deleteDoc(docRef);
      setDocToDelete(null);
      setOpenDialog(false);
      setSnackbarMessage("Analysis Data successfully deleted");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error removing document: ", error);
      setSnackbarMessage("Error deleting document");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteClick = (docId) => {
    setDocToDelete(docId);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setDocToDelete(null);
  };

  const handleEdit = (e, analys) => {
    e.preventDefault();
    setIsEditing(true);
    setSelectedAnalys(analys);
    setEditDate(dayjs(analys.date.toDate()));
    setEditInputKg(analys.kiloGram);
    setEditKgCubic(analys.kiloGram);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setEditDate(dayjs());
    setEditInputKg("");
    setEditCubicMeter("");
    setSelectedAnalys(null);
    setIsEditing(false);
  };

  const validateEdit = (kg) => {
    const isNumber = !isNaN(kg) && parseFloat(kg) > 0;
    if (!isNumber) {
      setEditError("Input KG must be a positive number");
      return false;
    }
    setEditError("");
    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateEdit(editInputKg)) return;

    try {
      const docRef = doc(db, "analysis", selectedAnalys.id);
      await updateDoc(docRef, {
        date: Timestamp.fromDate(editDate.toDate()),
        kiloGram: editInputKg,
        cubicMeter: editCubicMeter,
      });

      setEditDate(dayjs());
      setEditInputKg("");
      setEditCubicMeter("");
      setSelectedAnalys(null);
      setIsEditing(false);
      setSnackbarMessage("Analysis successfully updated");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating document: ", error);
      setSnackbarMessage("Error updating analysis");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const { dates, kilogramsData, cubicMetersData } = formatDataForChart(
    analysis,
    view
  );

  const sortedAnalysis = [...analysis].sort((a, b) => {
    const dateA = dayjs(a.date.toDate()).valueOf();
    const dateB = dayjs(b.date.toDate()).valueOf();
    return dateB - dateA;
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="analysispage">
      <Box sx={{ mb: 4 }}>
        <h2>Waste Analysis</h2>
      </Box>
      
      {!isEditing && (
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 2,
            mb: 4 
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker 
                label="Date" 
                value={addDate} 
                onChange={handleAddDate}
                sx={{ width: '100%' }}
              />
            </DemoContainer>
          </LocalizationProvider>
          <TextField
            label="Input KG"
            variant="outlined"
            value={inputKg}
            onChange={(e) => setKgCubic(e.target.value)}
            error={!!inputError}
            helperText={inputError}
            sx={{ 
              minWidth: 150,
              mt: inputError ? 0 : '8px'
            }}
          />
          <TextField
            label="Cubic Meters"
            variant="outlined"
            value={cubicMeter}
            disabled
            sx={{ 
              minWidth: 150,
              mt: '8px'
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleAdd}
            sx={{ 
              height: 56,
              mt: '8px'
            }}
          >
            Add
          </Button>
        </Box>
      )}

      {isEditing && (
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 2,
            mb: 4 
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker 
                label="Date" 
                value={editDate} 
                onChange={handleEditDate}
                sx={{ width: '100%' }}
              />
            </DemoContainer>
          </LocalizationProvider>
          <TextField
            label="Input KG"
            variant="outlined"
            value={editInputKg}
            onChange={(e) => setEditKgCubic(e.target.value)}
            error={!!editError}
            helperText={editError}
            sx={{ 
              minWidth: 150,
              mt: editError ? 0 : '8px'
            }}
          />
          <TextField
            label="Cubic Meters"
            variant="outlined"
            value={editCubicMeter}
            disabled
            sx={{ 
              minWidth: 150,
              mt: '8px'
            }}
          />
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            mt: '8px'
          }}>
            <Button 
              variant="contained" 
              onClick={handleUpdate}
              sx={{ height: 56 }}
            >
              Update
            </Button>
            <Button 
              variant="contained" 
              onClick={handleCancel}
              sx={{ height: 56 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}

      <Box sx={{ mb: 4 }}>
        <h3>View Data</h3>
        <ToggleButtonGroup
          color="primary"
          value={view}
          exclusive
          onChange={(e, nextView) => setView(nextView)}
          aria-label="analysis view"
          sx={{ mt: 2, mb: 2 }}
        >
          <ToggleButton value="daily">Daily</ToggleButton>
          <ToggleButton value="weekly">Weekly</ToggleButton>
          <ToggleButton value="monthly">Monthly</ToggleButton>
          <ToggleButton value="yearly">Yearly</ToggleButton>
        </ToggleButtonGroup>

        <BarChart
          xAxis={[{ scaleType: "band", data: dates }]}
          series={[
            {
              data: kilogramsData,
              label: "Kilograms",
            },
            {
              data: cubicMetersData,
              label: "Cubic Meters",
            },
          ]}
          width={900}
          height={400}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <h2>History</h2>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="analysis table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Kilogram</TableCell>
                <TableCell align="right">Cubic Meter</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAnalysis.map((analys) => (
                <TableRow
                  key={analys.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {dayjs(analys.date.toDate()).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell align="right">{analys.kiloGram}</TableCell>
                  <TableCell align="right">{analys.cubicMeter}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton onClick={(e) => handleEdit(e, analys)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteClick(analys.id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="delete-confirm-dialog-title"
        aria-describedby="delete-confirm-dialog-description"
      >
        <DialogTitle id="delete-confirm-dialog-title">Delete Item</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-confirm-dialog-description">
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AnalysisPage;

