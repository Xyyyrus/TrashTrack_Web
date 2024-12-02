import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword } from "../firebase";
import { Avatar, Button, CircularProgress, TextField, Typography, Box, CssBaseline, Container } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MessageSnackbar from "../components/MessageSnackbar";
import NavbarH from "./NavbarH";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Use navigate for navigation

  // Validation helper functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6; // Ensure password is at least 6 characters
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Perform validations
    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      setOpen(true);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters.");
      setOpen(true);
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Your email or password is invalid");
      console.log("Error Message" + error.message);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleHomeClick = () => {
    navigate("/"); // Navigate to the home page when the button is clicked
  };

  return (
    <>
      <NavbarH />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "black" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" color="black">
            Login Page
          </Typography>
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
            <TextField
              fullWidth
              margin="normal"
              required
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!validateEmail(email) && email !== ""}
              helperText={!validateEmail(email) && email !== "" ? "Invalid email format" : ""}
            />
            <TextField
              fullWidth
              margin="normal"
              required
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={password !== "" && !validatePassword(password)}
              helperText={password !== "" && !validatePassword(password) ? "Password must be at least 6 characters" : ""}
            />
            {!loading && (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            )}
            <Box sx={{ textAlign: "center" }}>
              {loading && <CircularProgress />}
            </Box>
          </Box>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleHomeClick}
            sx={{ mt: 2 }}
          >
            Home
          </Button>
        </Box>
        <MessageSnackbar
          open={open}
          handleClose={handleClose}
          message={error}
          severity={"warning"}
        />
      </Container>
    </>
  );
};

export default LoginPage; 