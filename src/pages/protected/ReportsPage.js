import {
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
  Button,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import dayjs from "dayjs";
import { Delete } from "@mui/icons-material";
import { useState, useEffect } from "react";
import CardMedia from "@mui/material/CardMedia";
import { ref, deleteObject } from "firebase/storage";
import {
  db,
  storage,
  doc,
  deleteDoc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
  writeBatch,
} from "../../firebase";

const ReportsPage = ({ reports }) => {
  const [posts, setPosts] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
// Snackbar state
const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");
const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchPosts = async () => {
      const postDocs = {};
      for (const report of reports) {
        const docRef = doc(db, "posts", report.postId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          postDocs[report.postId] = docSnap.data();
        }
      }
      setPosts(postDocs);
    };

    fetchPosts();
  }, [reports]);

  const getFilePathFromUrl = (url) => {
    const decodedUrl = decodeURIComponent(url.split("?")[0]);
    const path = decodedUrl.split("/o/")[1];

    if (path) {
      return path.replace(/%2F/g, "/");
    } else {
      return "";
    }
  };

  const handleDelete = async (report, postUrl) => {
    try {
      const isNotEmpty = (str) => str && str.trim() !== "";

      if (isNotEmpty(postUrl)) {
        const filePath = getFilePathFromUrl(postUrl);
        if (!filePath) {
          throw new Error("Invalid file path extracted from URL");
        }

        const fileRef = ref(storage, filePath);
        await deleteObject(fileRef);
        console.log("File successfully deleted from storage");
      }

      const reportsQuery = query(
        collection(db, "reports"),
        where("postId", "==", report.postId)
      );
      const reportsSnapshot = await getDocs(reportsQuery);

      if (!reportsSnapshot.empty) {
        const batch = writeBatch(db);
        reportsSnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        console.log("All matching reports successfully deleted!");
      } else {
        console.log("No reports found for the given postId.");
      }

      const postRef = doc(db, "posts", report.postId);
      await deleteDoc(postRef);
      
      // Show success message in snackbar
      setSnackbarMessage("Post and associated reports deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      console.log("Post document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
      // Show error message in snackbar
      setSnackbarMessage("Error deleting post!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error removing document: ", error);
    }
  };

  const handleRemoveFromReports = async (report) => {
    try {
      const reportsQuery = query(
        collection(db, "reports"),
        where("postId", "==", report.postId)
      );
      const reportsSnapshot = await getDocs(reportsQuery);

      if (!reportsSnapshot.empty) {
        const batch = writeBatch(db);
        reportsSnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        
      // Show success message in snackbar
      setSnackbarMessage("Post removed from reports successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
        console.log("Post successfully removed from the reports!");
      } else {
        console.log("No reports found for the given postId.");
      }
    } catch (error) {
      setSnackbarMessage("Error removing post from reports!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error removing post from reports: ", error);
    }
  };

  const handleOpenDialog = (action, report) => {
    setDialogAction(action);
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogAction(null);
    setSelectedReport(null);
  };

  const handleConfirmAction = () => {
    if (dialogAction === "delete") {
      handleDelete(selectedReport, posts[selectedReport.postId]?.url);
    } else if (dialogAction === "remove") {
      handleRemoveFromReports(selectedReport);
    }
    handleCloseDialog();
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  return (
    <div className="reportspage">
      <h2>Reports/ Forum Moderation</h2>
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="start">Reason</TableCell>
              <TableCell align="start">Report Date</TableCell>
              <TableCell align="start">Post Title</TableCell>
              <TableCell align="start">Post Body</TableCell>
              <TableCell align="start">Post Image</TableCell>
              <TableCell align="start">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell align="start">{report.reason}</TableCell>
                <TableCell align="start">
                  {dayjs(report.createdAt.toDate()).format("MMMM D, YYYY")}
                </TableCell>
                <TableCell align="start">
                  {posts[report.postId]?.title || "No title"}
                </TableCell>
                <TableCell align="start">
                  {posts[report.postId]?.body || "No body"}
                </TableCell>
                <TableCell align="start">
                  {(posts[report.postId]?.url && (
                    <CardMedia
                      component="img"
                      height="150"
                      image={posts[report.postId].url}
                      alt={posts[report.postId].title}
                    />
                  )) ||
                    "No image"}
                </TableCell>
                <TableCell align="start">
                <Tooltip title="Delete">
                  <IconButton                        color="error"
                    onClick={() => handleOpenDialog("delete", report)}
                  >
                    <Delete />
                  </IconButton>
                  </Tooltip>
                  <Tooltip title="Remove Report">
                  <IconButton
                    onClick={() => handleOpenDialog("remove", report)}
                  >
                   <span
  style={{
    display: "inline-block",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: "Gray", 
    color: "white",
    textAlign: "center",
    lineHeight: "24px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  }}
>
  X
</span>

                  </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogAction === "delete"
            ? "Delete Post Confirmation"
            : "Remove From Reports Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogAction === "delete"
              ? "Are you sure you want to delete this post and all associated reports?"
              : "Are you sure you want to remove this post from the reports? The post itself will not be deleted."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmAction} color="error" variant="contained" autoFocus>
            Confirm
          </Button>
        </DialogActions>
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

export default ReportsPage;
