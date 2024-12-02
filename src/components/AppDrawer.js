import React, { useState } from "react";
import { Drawer, List } from "@mui/material";
import {
  Analytics,
  Announcement,
  CalendarMonth,
  Dashboard,
  FireTruck,
  Logout,
  People,
  Report,
  Route,
} from "@mui/icons-material";
import { auth, signOut } from "../firebase";
import DrawerItem from "./DrawerItem";
import { useNonce } from "../context/NonceContext"; // Import the useNonce hook

const AppDrawer = ({ selected, setPage, uinfo }) => {
  const [loading, setLoading] = useState(false);
  const nonce = useNonce(); // Get the nonce value from the context

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const renderDrawerItems = () => {
    if (!uinfo) return null;

    switch (uinfo.role) {
      case "Super Admin":
        return (
          <>
            <DrawerItem
              selected={selected}
              index={0}
              onClick={() => setPage(0)}
              icon={<Dashboard />}
              text="Dashboard"
            />
            <DrawerItem
              selected={selected}
              index={1}
              onClick={() => setPage(1)}
              icon={<Route />}
              text="Routes"
            />
            <DrawerItem
              selected={selected}
              index={2}
              onClick={() => setPage(2)}
              icon={<CalendarMonth />}
              text="Schedules"
            />
            <DrawerItem
              selected={selected}
              index={3}
              onClick={() => setPage(3)}
              icon={<FireTruck />}
              text="Fleets"
            />
            <DrawerItem
              selected={selected}
              index={4}
              onClick={() => setPage(4)}
              icon={<People />}
              text="Users"
            />
            <DrawerItem
              selected={selected}
              index={5}
              onClick={() => setPage(5)}
              icon={<Announcement />}
              text="Announcements"
            />
            <DrawerItem
              selected={selected}
              index={6}
              onClick={() => setPage(6)}
              icon={<Analytics />}
              text="Analysis"
            />
            <DrawerItem
              selected={selected}
              index={7}
              onClick={() => setPage(7)}
              icon={<Report />}
              text="Reports"
            />
            <DrawerItem
              selected={selected}
              index={8}
              onClick={loading ? undefined : handleLogout}
              icon={<Logout />}
              text={loading ? "Loading..." : "Logout"}
            />
          </>
        );

      case "Admin":
        return (
          <>
            <DrawerItem
              selected={selected}
              index={0}
              onClick={() => setPage(0)}
              icon={<Dashboard />}
              text="Dashboard"
            />
            <DrawerItem
              selected={selected}
              index={1}
              onClick={() => setPage(1)}
              icon={<Route />}
              text="Routes"
            />
            <DrawerItem
              selected={selected}
              index={2}
              onClick={() => setPage(2)}
              icon={<CalendarMonth />}
              text="Schedules"
            />
            <DrawerItem
              selected={selected}
              index={3}
              onClick={() => setPage(3)}
              icon={<FireTruck />}
              text="Fleets"
            />
            <DrawerItem
              selected={selected}
              index={5}
              onClick={() => setPage(5)}
              icon={<Announcement />}
              text="Announcements"
            />
            <DrawerItem
              selected={selected}
              index={6}
              onClick={() => setPage(6)}
              icon={<Analytics />}
              text="Analysis"
            />
            <DrawerItem
              selected={selected}
              index={7}
              onClick={() => setPage(7)}
              icon={<Report />}
              text="Reports"
            />
            <DrawerItem
              selected={selected}
              index={8}
              onClick={loading ? undefined : handleLogout}
              icon={<Logout />}
              text={loading ? "Loading..." : "Logout"}
            />
          </>
        );

      case "Student":
        return (
          <>
            <DrawerItem
              selected={selected}
              index={0}
              onClick={() => setPage(0)}
              icon={<Dashboard />}
              text="Dashboard"
            />
            <DrawerItem
              selected={selected}
              index={6}
              onClick={() => setPage(6)}
              icon={<Analytics />}
              text="Analysis"
            />
            <DrawerItem
              selected={selected}
              index={8}
              onClick={loading ? undefined : handleLogout}
              icon={<Logout />}
              text={loading ? "Loading..." : "Logout"}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="appdrawer">
      <Drawer
        sx={{
          width: 300,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 300,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {nonce && (
          <style nonce={nonce}>{`
            .appdrawer {
              /* Example: Apply styles dynamically using nonce */
              background-color: #f4f4f4;
            }
          `}</style>
        )}

        <List>{renderDrawerItems()}</List>
      </Drawer>
    </div>
  );
};

export default AppDrawer;
