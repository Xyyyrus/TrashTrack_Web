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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Tooltip,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  db,
  collection,
  addDoc,
  storage,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "../../firebase";
import { Delete, Edit } from "@mui/icons-material";
import dayjs from "dayjs";

const AnnouncementsPage = ({ announces }) => {
  const [addTitle, setAddTitle] = useState("");
  const [addBody, setAddBody] = useState("");
  const [addImage, setAddImage] = useState(null);
  const [addError, setAddError] = useState("");
  const [editError, setEditError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAnnounce, setSelectedAnnounce] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [expireDate, setExpireDate] = useState("");
  const [editExpireDate, setEditExpireDate] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [openDialog, setOpenDialog] = useState(false);
  const [announceToDelete, setAnnounceToDelete] = useState(null);

  useEffect(() => {
    const checkExpiredAnnouncements = async () => {
      const now = Timestamp.fromDate(new Date());
      const announcementsRef = collection(db, "announcements");
      const q = query(announcementsRef, where("expireDate", "<=", now));
      
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          const announcement = { id: doc.id, ...doc.data() };
          // Delete the image from storage
          if (announcement.url) {
            const filePath = getFilePathFromUrl(announcement.url);
            if (filePath) {
              const fileRef = ref(storage, filePath);
              await deleteObject(fileRef);
            }
          }
          // Delete the document
          await deleteDoc(doc.ref);
        });
      } catch (error) {
        console.error("Error checking expired announcements:", error);
      }
    };

    // Check for expired announcements every minute
    const interval = setInterval(checkExpiredAnnouncements, 60000);
    return () => clearInterval(interval);
  }, []);


  const handleAddUpload = (e) => {
    if (e.target.files[0]) {
      setAddImage(e.target.files[0]);
    }
  };

  const handleEditUpload = (e) => {
    if (editImage) {
      setEditImage(e.target.files[0]);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAddError("");

    if (!addTitle.trim()) {
      setAddError("Title is required.");
      return;
    }
    if (!addBody.trim()) {
      setAddError("Body is required.");
      return;
    }
    if (!addImage) {
      setAddError("Image is required.");
      return;
    }
    if (!expireDate) {
      setAddError("Expiration date is required.");
      return;
    }

    try {
      const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss.SSSSSS");
      const fileExtension = addImage.name.split(".").pop();
      const newFileName = `${timestamp}.${fileExtension}`;
      const imageRef = ref(storage, `announcements_images/${newFileName}`);
      await uploadBytes(imageRef, addImage);
      const url = await getDownloadURL(imageRef);

      await addDoc(collection(db, "announcements"), {
        title: addTitle,
        body: addBody,
        url: url,
        createdAt: Timestamp.fromDate(dayjs().toDate()),
        expireDate: Timestamp.fromDate(dayjs(expireDate).toDate())
      });

      setAddTitle("");
      setAddBody("");
      setAddImage(null);
      setExpireDate("");

      setSnackbarMessage("Announcement successfully added!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding announcement: ", error);
      setAddError("Failed to add announcement. Please try again.");
    }
  };

  

  const getFilePathFromUrl = (url) => {
    const decodedUrl = decodeURIComponent(url.split("?")[0]);
    const path = decodedUrl.split("/o/")[1];

    if (path) {
      return path.replace(/%2F/g, "/");
    } else {
      return "";
    }
  };

  const handleDeleteClick = (e, announce) => {
    e.preventDefault();
    setAnnounceToDelete(announce); // Set the selected announcement for deletion
    setOpenDialog(true); // Open the delete confirmation dialog
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setAnnounceToDelete(null);
  };

  const handleDelete = async () => {
    if (!announceToDelete) return;

    const { id, url } = announceToDelete;

    try {
      const filePath = getFilePathFromUrl(url);

      if (!filePath) {
        throw new Error("Invalid file path extracted from URL");
      }

      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);

      console.log("File successfully deleted from storage");

      const docRef = doc(db, "announcements", id);
      await deleteDoc(docRef);

      setSnackbarMessage("Announcement successfully deleted!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      console.log("Document successfully deleted!");
    } catch (error) {
      setSnackbarMessage("Failed to delete announcement");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error removing document: ", error);
    }

    handleDialogClose(); // Close the dialog after deletion
  };

  const handleEdit = async (e, announce) => {
    e.preventDefault();
    setIsEditing(true);
    setSelectedAnnounce(announce);
    setEditTitle(announce.title);
    setEditBody(announce.body);
    setEditExpireDate(dayjs(announce.expireDate.toDate()).format("YYYY-MM-DD"));
  };

  const handleCancel = async (e) => {
    e.preventDefault();

    setEditTitle("");
    setEditBody("");
    setSelectedAnnounce(null);
    setIsEditing(false);
  };

const handleUpdate = async (e) => {
    e.preventDefault();
    setEditError("");
  
    if (!editTitle.trim()) {
      setEditError("Title is required.");
      return;
    }
    if (!editBody.trim()) {
      setEditError("Body is required.");
      return;
    }
    if (!editImage && !selectedAnnounce.url) {
      setEditError("Image is required.");
      return;
    }
    if (!editExpireDate) {
      setEditError("Expiration date is required.");
      return;
    }
  
    try {
      let url = selectedAnnounce.url;
      if (editImage) {
        const path = decodeURIComponent(url.split("o/")[1].split("?")[0]);
  
        let imageRef = ref(storage, path);
        await deleteObject(imageRef);
  
        const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss.SSSSSS");
        const fileExtension = editImage.name.split(".").pop();
        const newFileName = `${timestamp}.${fileExtension}`;
  
        imageRef = ref(storage, `announcements_images/${newFileName}`);
        await uploadBytes(imageRef, editImage);
        url = await getDownloadURL(imageRef);
      }
  
      const docRef = doc(db, "announcements", selectedAnnounce.id);
      await updateDoc(docRef, {
        title: editTitle,
        body: editBody,
        url: url,
        expireDate: Timestamp.fromDate(dayjs(editExpireDate).toDate())
      });
  
      setEditTitle("");
      setEditBody("");
      setEditImage(null);
      setEditExpireDate("");
      setSelectedAnnounce(null);
      setIsEditing(false);
      setSnackbarMessage("Announcement successfully updated!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating announcement: ", error);
      setEditError("Failed to update announcement. Please try again.");
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <div className="announcementspage">
      <h2>Announcements</h2>
      {!isEditing && (
        <Box sx={{ display: "flex", marginTop: "10px" }}>
          <FormControl fullWidth sx={{ marginRight: "20px" }}>
            <InputLabel>Title</InputLabel>
            <Input
              type="text"
              value={addTitle}
              onChange={(e) => setAddTitle(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginRight: "20px" }}>
            <InputLabel>Body</InputLabel>
            <Input
              type="text"
              value={addBody}
              onChange={(e) => setAddBody(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginRight: "20px" }}>
            <Input
              onChange={handleAddUpload}
              sx={{ height: "48px" }}
              type="file"
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginRight: "20px" }}>
            <TextField
              type="date"
              label="Expire Date"
              value={expireDate}
              onChange={(e) => setExpireDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          {addError && <Typography color="error">{addError}</Typography>}
          <Button
            sx={{ width: "300px", backgroundColor: "primary.main" }}
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
            <InputLabel>Title</InputLabel>
            <Input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginRight: "20px" }}>
            <InputLabel>Body</InputLabel>
            <Input
              type="text"
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginRight: "20px" }}>
            <Input
              onChange={handleEditUpload}
              sx={{ height: "48px" }}
              type="file"
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginRight: "20px" }}>
            <TextField
              type="date"
              label="Expire Date"
              value={editExpireDate}
              onChange={(e) => setEditExpireDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <Button
            sx={{ width: "300px", marginRight: "20px", backgroundColor: "error.main" }}
            variant="contained"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          {editError && <Typography color="error">{editError}</Typography>}
          <Button
            sx={{ width: "300px", backgroundColor: "primary.main" }}
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
              <TableCell align="start">Title</TableCell>
              <TableCell align="start">Body</TableCell>
              <TableCell align="start">Created Date</TableCell>
              <TableCell align="start">Expire Date</TableCell>
              <TableCell align="start">Image</TableCell>
              <TableCell align="start">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {announces.map((announce) => (
              <TableRow key={announce.id}>
                <TableCell align="start">{announce.title}</TableCell>
                <TableCell align="start">{announce.body}</TableCell>
                <TableCell align="start">
                  {dayjs(announce.createdAt.toDate()).format("MMMM D, YYYY")}
                </TableCell>
                <TableCell align="start">
                  {dayjs(announce.expireDate.toDate()).format("MMMM D, YYYY")}
                </TableCell>
                <TableCell align="start">
                  <Avatar alt={announce.title} src={announce.url} />
                </TableCell>
                <TableCell align="start">
                  <Tooltip title="Edit">
                    <IconButton onClick={(e) => handleEdit(e, announce)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={(e) => handleDeleteClick(e, announce)}>
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
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Announcement?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this announcement?
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AnnouncementsPage;