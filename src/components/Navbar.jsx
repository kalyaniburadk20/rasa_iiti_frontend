import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Logo from "../assets/Logo.png";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const onAvatarChat = location.pathname === "/avatarchat";

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "8%",
        background: "rgba(0, 0, 0, 0.6)",                // ✅ Transparent dark
        backdropFilter: "blur(8px)",                      // ✅ Glassmorphism blur
        WebkitBackdropFilter: "blur(8px)",                // ✅ Safari support
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)", // ✅ Thin bottom border
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",        // ✅ Subtle shadow
        color: "#ffffff",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      {/* Left: IIT Logo */}
      <a href="https://www.iiti.ac.in/" target="_blank" rel="noopener noreferrer">
        <img
          src={Logo}
          alt="IIT Indore Logo"
          style={{ height: "50px", cursor: "pointer" }}
        />
      </a>

      {/* Center: Title or Back Button */}
      {onAvatarChat ? (
        <button
          onClick={() => navigate("/")}
          style={{
            background: "#10b981",
            border: "none",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          ← Back to Home
        </button>
      ) : (
        <h1 style={{ fontSize: "26px", fontWeight: "bold", color: "#00f7ff", letterSpacing: "1px" }}>
          Connect With AI Chatbot
        </h1>
      )}

      {/* Right Side: Navigation + Auth */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {["Home", "Chat", "About"].map((label) => (
          <button
            key={label}
            onClick={() =>
              navigate(label === "Chat" ? "/avatarchat" : `/${label.toLowerCase()}`)
            }
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              textDecoration: "none",
              cursor: "pointer",
              fontSize: "15px",
              letterSpacing: "0.5px",
            }}
          >
            {label}
          </button>
        ))}

        {isAuthenticated && user && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src={user.picture}
              alt={user.name}
              style={{ height: "30px", width: "30px", borderRadius: "50%" }}
            />
            <span style={{ fontSize: "13px", fontWeight: 500 }}>{user.name}</span>
          </div>
        )}

        {!isAuthenticated ? (
          <button
            onClick={() => loginWithRedirect()}
            style={{
              background: "#2563eb",
              border: "none",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        ) : (
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
            style={{
              background: "#ef4444",
              border: "none",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
