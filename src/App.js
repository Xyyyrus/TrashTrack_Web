import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth, doc, db, getDoc, signOut } from "./firebase";
import { useState, useEffect, Suspense, lazy } from "react";
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material/styles";

// Code split components remain the same
const HomePage = lazy(() => import("./pages/protected/HomePage"));
const LoadingPage = lazy(() => import("./pages/LoadingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const Landpage = lazy(() => import("./pages/Landpage"));
const StartNowPage = lazy(() => import("./pages/StartNowPage"));

// Create theme with nonce
function App() {


  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#173634",
      },
      secondary: {
        main: "#006150",
        light: "#F3F7FF",
      },
      background: {
        default: "#F3F7FF",
        paper: "#fffdfd",
      },
    },
    typography: {
      fontFamily: ["Roboto"],
    },
    
  });

  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = doc(db, "users", user.uid);
          const userSnap = await getDoc(userDoc);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            const userRole = userData.role;

            if (userRole === "Student" || userRole === "Admin" || userRole === "Super Admin") {
              setAllowed(true);
            } else {
              await signOut(auth);
              setAllowed(false);
              console.log("Access denied for this role");
            }
          } else {
            console.log("User does not exist");
            setAllowed(false);
          }
        } catch (error) {
          console.log("Error fetching data: " + error);
          setAllowed(false);
        }
      } else {
        setAllowed(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <LoadingPage />
      </Suspense>
    );
  }

  return (

    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {allowed ? (
                <>
                  <Route path="/" element={<HomePage />} />
                  <Route path="*" element={<HomePage />} />
                </>
              ) : (
                <>
                  <Route path="/adminlogin" element={<LoginPage/>} />
                  <Route path="*" element={<Landpage />} />
                  <Route path="/startnow" element={<StartNowPage />} />
                </>
              )}
            </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>

  );
}

export default App;