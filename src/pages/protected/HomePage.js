import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import AppDrawer from "../../components/AppDrawer";
import DashboardPage from "./DashboardPage";
import RoutesPage from "./RoutesPage";
import SchedulesPage from "./SchedulesPage";
import FleetsPage from "./FleetsPage";
import UsersPage from "./UsersPage";
import AnnouncementsPage from "./AnnouncementsPage";
import AnalysisPage from "./AnalysisPage";
import LoadingPage from "../LoadingPage";
import { db, collection, onSnapshot, auth, doc, getDoc } from "../../firebase";
import ReportsPage from "./ReportsPage";

const HomePage = () => {
  const [uinfo, setUinfo] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [fleets, setFleets] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [users, setUsers] = useState([]);
  const [announces, setAnnounces] = useState([]);
  const [analysis, setAnalysis] = useState([]);
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(0);

  const fetchCollectionData = (colName, setter) => {
    const colRef = collection(db, colName);
    return onSnapshot(
      colRef,
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setter(data);
      },
      (error) => console.error(`Error fetching ${colName} documents: `, error)
    );
  };

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          setUinfo(userSnap.data());
        } else {
          console.log("User does not exist");
        }
      }
    });

    const unsubRoutes = fetchCollectionData("routes", setRoutes);
    const unsubFleets = fetchCollectionData("fleets", setFleets);
    const unsubSchedules = fetchCollectionData("schedules", setSchedules);
    const unsubUsers = fetchCollectionData("users", setUsers);
    const unsubAnnounces = fetchCollectionData("announcements", setAnnounces);
    const unsubAnalysis = fetchCollectionData("analysis", setAnalysis);
    const unsubReports = fetchCollectionData("reports", setReports);

    return () => {
      unsubAuth();
      unsubRoutes();
      unsubFleets();
      unsubSchedules();
      unsubUsers();
      unsubAnnounces();
      unsubAnalysis();
      unsubReports();
    };
  }, []);

  const setPage = (index) => setSelected(index);

  const renderContent = () => {
    if (!uinfo) return <LoadingPage />;

    const rolePages = {
      "Super Admin": [
        <DashboardPage
          uinfo={uinfo}
          fleets={fleets}
          schedules={schedules}
          users={users}
          routes={routes}
        />,
        <RoutesPage routes={routes} />,
        <SchedulesPage routes={routes} fleets={fleets} users={users} schedules={schedules} />,
        <FleetsPage fleets={fleets} />,
        <UsersPage users={users} routes={routes} />,
        <AnnouncementsPage announces={announces} />,
        <AnalysisPage analysis={analysis} />,
        <ReportsPage reports={reports} />
      ],
      "Admin": [
        <DashboardPage
          uinfo={uinfo}
          fleets={fleets}
          schedules={schedules}
          users={users}
          routes={routes}
        />,
        <RoutesPage routes={routes} />,
        <SchedulesPage routes={routes} fleets={fleets} users={users} schedules={schedules} />,
        <FleetsPage fleets={fleets} />,
        null, // Users page skipped for Admin role
        <AnnouncementsPage announces={announces} />,
        <AnalysisPage analysis={analysis} />,
        <ReportsPage reports={reports} />
      ],
      "Student": [
        <DashboardPage
          uinfo={uinfo}
          fleets={fleets}
          schedules={schedules}
          users={users}
          routes={routes}
        />,
        null, // Skipping pages 1-5 for Student role
        null,
        null,
        null,
        null,
        <AnalysisPage analysis={analysis} />
      ]
    };

    return rolePages[uinfo.role]?.[selected] ?? <LoadingPage />;
  };

  return (
    <div className="homepage">
      {uinfo ? (
        <Box sx={{ display: "flex" }}>
          <AppDrawer selected={selected} setPage={setPage} uinfo={uinfo} />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            {renderContent()}
          </Box>
        </Box>
      ) : (
        <LoadingPage />
      )}
    </div>
  );
};

export default HomePage;
