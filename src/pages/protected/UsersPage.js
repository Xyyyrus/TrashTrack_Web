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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Tooltip,Snackbar,
  Alert,
} from "@mui/material";
import DropdownMenu from "../../components/DropdownMenu";
import { useState } from "react";
import { functions } from "../../firebase";
import { db, doc, setDoc, deleteDoc, updateDoc } from "../../firebase";
import { httpsCallable } from "firebase/functions";
import { Delete, Edit } from "@mui/icons-material";

const UsersPage = ({ users, routes }) => {
  const [addFirstname, setAddFirstname] = useState("");
  const [addLastname, setAddLastname] = useState("");
  const [addRouteId, setAddRouteId] = useState(routes[0]?.id || "");
  const [addEmail, setAddEmail] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addRole, setAddRole] = useState("User");
  const [openDialog, setOpenDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFirstname, setEditFirstname] = useState("");
  const [editLastname, setEditLastname] = useState("");
  const [editRouteId, setEditRouteId] = useState(routes[0]?.id || "");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState("User");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
 // Snackbar state
 const [snackbarOpen, setSnackbarOpen] = useState(false);
 const [snackbarMessage, setSnackbarMessage] = useState("");
 const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [inputErrors, setInputErrors] = useState({}); // State for input validation errors
  const handleEditBarangay = (value) => setEditRouteId(value);
  const handleAddRole = (value) => setAddRole(value);
  const handleEditRole = (value) => setEditRole(value);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Input validation for required fields
  const validateFields = (fields, isUpdate = false) => {
    const errors = {};

    if (!fields.firstname.trim()) errors.firstname = "Firstname is required";
    if (!fields.lastname.trim()) errors.lastname = "Lastname is required";
    if (!fields.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(fields.email)) {
      errors.email = "Invalid email address";
    }
    if (!isUpdate && !fields.password.trim()) errors.password = "Password is required";
    if (!fields.role.trim()) errors.role = "Role is required";

    return errors;
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const errors = validateFields({
      firstname: addFirstname,
      lastname: addLastname,
      email: addEmail,
      password: addPassword,
      role: addRole,
    });

    setInputErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      const createUser = httpsCallable(functions, "createUser");

      const data = await createUser({
        email: addEmail,
        password: addPassword,
        displayName: `${addFirstname} ${addLastname}`,
      });

      const userRef = doc(db, "users", data.data.userId);
      await setDoc(userRef, {
        firstname: addFirstname,
        lastname: addLastname,
        barangay: addRole === "User" ? addRouteId : "",
        email: addEmail,
        role: addRole,
      });

      // Reset fields
      setAddFirstname("");
      setAddLastname("");
      setAddRouteId(routes[0]?.id || "");
      setAddEmail("");
      setAddPassword("");
      setAddRole("User");
      setInputErrors({});
      setSnackbarMessage("User successfully added!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      console.log("User successfully inserted");
    } catch (error) {
      setSnackbarMessage("Error adding User. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error adding user: ", error);
    }
  };

  const handleDelete = (e, user) => {
    e.preventDefault();
    console.log(user);  
    setUserIdToDelete(user);  
    setOpenDialog(true); 
  };
  
  
  const confirmDelete = async () => {
    if (userIdToDelete) {
      try {
        const deleteUser = httpsCallable(functions, "deleteUser");
        await deleteUser({ uid: userIdToDelete.id });
        await deleteDoc(doc(db, "users", userIdToDelete.id));
        console.log("User successfully deleted");
        setSnackbarMessage("User successfully deleted!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (error) {
        setSnackbarMessage("Error deleting User. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        console.error("Error removing document: ", error);
      }
    }
    setOpenDialog(false);
    setUserIdToDelete(null);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setUserIdToDelete(null);
  };


  const handleEdit = (e, user) => {
    e.preventDefault();
    setIsEditing(true);
    setSelectedUser(user);
    setEditFirstname(user.firstname);
    setEditLastname(user.lastname);
    setEditRouteId(user.barangay);
    setEditEmail(user.email);
    setEditRole(user.role);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setEditFirstname("");
    setEditLastname("");
    setEditRouteId(routes[0]?.id || "");
    setEditEmail("");
    setEditPassword("");
    setEditRole("User");
    setSelectedUser(null);
    setIsEditing(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const errors = validateFields({
      firstname: editFirstname,
      lastname: editLastname,
      email: editEmail,
      password: editPassword,
      role: editRole,
    }, true);

    setInputErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      const updateUser = httpsCallable(functions, "updateUser");
      if (editPassword.trim()) {
        await updateUser({
          uid: selectedUser.id,
          email: editEmail,
          password: editPassword,
          displayName: `${editFirstname} ${editLastname}`,
        });
      } else {
        await updateUser({
          uid: selectedUser.id,
          email: editEmail,
          displayName: `${editFirstname} ${editLastname}`,
        });
      }

      const docRef = doc(db, "users", selectedUser.id);
      await updateDoc(docRef, {
        firstname: editFirstname,
        lastname: editLastname,
        barangay: editRole === "User" ? editRouteId : "",
        email: editEmail,
        role: editRole,
      });
      setSnackbarMessage("User successfully updated!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      handleCancel(e);
      console.log("User successfully updated");
    } catch (error) {
      setSnackbarMessage("Error updating User. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error updating user: ", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    (user.firstname?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (user.lastname?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (user.routeName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (user.role?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <div className="userspage">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Users</h2>
        <FormControl sx={{ width: "300px" }}>
          <InputLabel>Search</InputLabel>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </FormControl>
      </Box>

      {!isEditing && (
        <Box sx={{ display: "flex", marginTop: "10px" }}>
          <FormControl fullWidth sx={{ marginRight: "20px" }} error={!!inputErrors.firstname}>
            <InputLabel>Firstname</InputLabel>
            <Input
              type="text"
              value={addFirstname}
              onChange={(e) => setAddFirstname(e.target.value)}
            />
            {inputErrors.firstname && <p>{inputErrors.firstname}</p>}
          </FormControl>
          <FormControl fullWidth sx={{ marginRight: "20px" }} error={!!inputErrors.lastname}>
            <InputLabel>Lastname</InputLabel>
            <Input
              type="text"
              value={addLastname}
              onChange={(e) => setAddLastname(e.target.value)}
            />
            {inputErrors.lastname && <p>{inputErrors.lastname}</p>}
          </FormControl>
          
          <FormControl fullWidth sx={{ marginRight: "20px" }} error={!!inputErrors.email}>
            <InputLabel>Email</InputLabel>
            <Input
              type="text"
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
            />
            {inputErrors.email && <p>{inputErrors.email}</p>}
          </FormControl>
          <FormControl fullWidth sx={{ marginRight: "20px" }} error={!!inputErrors.password}>
            <InputLabel>Password</InputLabel>
            <Input
              type="password"
              value={addPassword}
              onChange={(e) => setAddPassword(e.target.value)}
            />
            {inputErrors.password && <p>{inputErrors.password}</p>}
          </FormControl>
          <DropdownMenu
            handleChange={handleAddRole}
            selectedId={addRole}
            options={[
              { id: "Admin", name: "Admin" },
              { id: "Student", name: "Student" },
              { id: "Super Admin", name: "Super Admin" },
            ]}
            label={"Role"}
          />
          <Button sx={{ width: "300px" }} variant="contained" onClick={handleAdd}>
            Add User
          </Button>
        </Box>
      )}

      {isEditing && (
        <Box sx={{ display: "flex", marginTop: "10px" }}>
          <FormControl fullWidth sx={{ marginRight: "20px" }} error={!!inputErrors.firstname}>
            <InputLabel>Firstname</InputLabel>
            <Input
              type="text"
              value={editFirstname}
              onChange={(e) => setEditFirstname(e.target.value)}
            />
            {inputErrors.firstname && <p>{inputErrors.firstname}</p>}
          </FormControl>
          <FormControl fullWidth sx={{ marginRight: "20px" }} error={!!inputErrors.lastname}>
            <InputLabel>Lastname</InputLabel>
            <Input
              type="text"
              value={editLastname}
              onChange={(e) => setEditLastname(e.target.value)}
            />
            {inputErrors.lastname && <p>{inputErrors.lastname}</p>}
          </FormControl>
          {editRole === "User" && (
            <DropdownMenu
              handleChange={handleEditBarangay}
              selectedId={editRouteId}
              options={routes.map((route) => ({
                id: route.id,
                name: route.routeName,
              }))}
              label="Barangay"
            />
          )}
          <FormControl fullWidth sx={{ marginRight: "20px" }} error={!!inputErrors.email}>
            <InputLabel>Email</InputLabel>
            <Input
              type="text"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
            {inputErrors.email && <p>{inputErrors.email}</p>}
          </FormControl>
          <FormControl fullWidth sx={{ marginRight: "20px" }} error={!!inputErrors.password}>
            <InputLabel>Password (Optional)</InputLabel>
            <Input
              type="password"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
            />
            {inputErrors.password && <p>{inputErrors.password}</p>}
          </FormControl>
          <DropdownMenu
            handleChange={handleEditRole}
            selectedId={editRole}
            options={[
              { id: "User", name: "User" },
              { id: "Admin", name: "Admin" },
              { id: "Student", name: "Student" },
              { id: "Super Admin", name: "Super Admin" },
            ]}
            label={"Role"}
          />
          <Button sx={{ width: "300px" }} variant="contained" onClick={handleUpdate}>
            Update User
          </Button>
          <Button sx={{ width: "300px" }} variant="contained" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      )}

      <TableContainer component={Paper} sx={{ marginTop: "50px" }}>
        <Table sx={{ minWidth: 650 }} aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>Firstname</TableCell>
              <TableCell>Lastname</TableCell>
              <TableCell>Barangay</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => {
                            const route = routes.find((r) => r.id === user.barangay);
                            return (   
              <TableRow key={user.id}>
                <TableCell>{user.firstname}</TableCell>
                <TableCell>{user.lastname}</TableCell>
                <TableCell> {route ? route.routeName : "---"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                <Tooltip title="Edit">
                  <IconButton onClick={(e) => handleEdit(e, user)}>
                    <Edit />
                  </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                <IconButton color="error" onClick={(e) => handleDelete(e, user)}>
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
      <Dialog open={openDialog} onClose={handleCancelDelete}>
  <DialogTitle>Confirm Deletion</DialogTitle>
  <DialogContent>
  <DialogContentText>
  {userIdToDelete
    ? `Are you sure you want to delete user ${userIdToDelete?.firstname || 'Firstname'} ${userIdToDelete?.lastname || 'Lastname'} (${userIdToDelete?.email || 'email'})?`
    : "Are you sure you want to delete this user?"} 
  This action cannot be undone.
</DialogContentText>

  </DialogContent>
  <DialogActions>
    <Button onClick={handleCancelDelete} color="primary">
      Cancel
    </Button>
    <Button onClick={confirmDelete} color="error" variant="contained">
      Confirm
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

export default UsersPage;
