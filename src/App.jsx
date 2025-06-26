import { BrowserRouter as Router, Routes, Route, useLocation, Link } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Chatbox from "./components/Chatbox";
import AnimatedSections from "./scenes/AnimatedSections.jsx";
import Scene from "./scenes/Scene.jsx";
import AvatarChat from "./components/AvatarChat.jsx";
import Calendar from "./components/Calendar.jsx"; // 🔥 Import the calendar component

const AppContent = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading) return <div>Loading authentication...</div>;
  if (!isAuthenticated) return null;

  // Fullscreen avatar chat layout
  if (location.pathname === "/avatarchat") {
    return (
      <>
        <Navbar />
        <AvatarChat />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* Existing routes */}
        <Route path="/avatarchat" element={<AvatarChat />} />
        <Route path="/calendar" element={<Calendar />} /> {/* 🔥 Add calendar route */}
      </Routes>

      {/* Main App Layout */}
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <AnimatedSections />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            marginTop: "60px",
            pointerEvents: "none",
          }}
        >
          <div style={{ width: "40%", height: "100vh", position: "relative", zIndex: 2 }}>
            <Scene />
          </div>
          <div
            style={{
              width: "60%",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column", // 🔥 Stack Chatbox + button vertically
              position: "relative",
              zIndex: 2,
              pointerEvents: "auto", // 🔥 Enable clicks
            }}
          >
            <Chatbox />
            <Link to="/calendar" style={{ marginTop: "20px" }}>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "rgb(0, 217, 255)",
                  color: "black",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginLeft: "140px",
                  marginBottom: "110px",
                  fontWeight: 600,
                }}
              >
                Open Calendar
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
