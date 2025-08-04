import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Calendar,
  Ticket,
  Users,
  BarChart2,
  UserPlus,
  LogOut,
  ChevronDown,
  Home,
  LogIn,
  PlusCircle,
} from "lucide-react";

const Sidebar = ({ onLogout }) => {
  const [openSections, setOpenSections] = useState({
    main: true,
    account: true,
  });

  // ✅ Check if user is logged in
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const linkStyle = ({ isActive, disabled }) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "8px",
    textDecoration: "none",
    color: disabled ? "rgba(255,255,255,0.5)" : isActive ? "#5A37F1" : "white",
    backgroundColor: isActive ? "white" : "transparent",
    fontWeight: isActive ? "600" : "400",
    pointerEvents: disabled ? "none" : "auto", // 🔒 disables clicking if logged out
    opacity: disabled ? 0.5 : 1,
  });

  return (
    <div
      className="d-flex flex-column"
      style={{
        width: "260px",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "#5A37F1",
        padding: "20px",
        borderTopRightRadius: "20px",
        borderBottomRightRadius: "20px",
      }}
    >
      {/* ✅ Logo + Title */}
      <div className="mb-4 d-flex align-items-center gap-2">
        <img src="/logo.png" alt="EventMate" style={{ height: "40px" }} />
        <h4 className="fw-bold text-white mb-0">EventMate</h4>
      </div>

      {/* ✅ Create Quick Event Button */}
      <NavLink
        to={isLoggedIn ? "/add-events" : "#"} // 🔒 only works if logged in
        style={linkStyle({ isActive: false, disabled: !isLoggedIn })}
        className="btn btn-light d-flex align-items-center gap-2 mb-3 fw-semibold"
      >
        <Home size={20} />
        Create A Quick Event
      </NavLink>

      <hr className="border-light opacity-25" />

      {/* ✅ If NOT Logged In */}
      {!isLoggedIn && (
        <div className="mb-3">
          <div className="d-flex flex-column gap-2">
            <NavLink to="/login" style={linkStyle({ isActive: false })}>
              <LogIn size={18} />
              Login
            </NavLink>

            <NavLink to="/register" style={linkStyle({ isActive: false })}>
              <PlusCircle size={18} />
              Create Account
            </NavLink>
          </div>
          <hr className="border-light opacity-25 mt-3" />
        </div>
      )}

      {/* ✅ MAIN NAVIGATION */}
      <div className="mb-3">
        <div
          className="d-flex justify-content-between align-items-center text-white"
          onClick={() => toggleSection("main")}
          style={{ cursor: "pointer" }}
        >
          <span className="fw-bold">Main Navigation</span>
          <ChevronDown
            size={18}
            className={openSections.main ? "rotate-180" : ""}
          />
        </div>

        {openSections.main && (
          <div className="mt-2 d-flex flex-column gap-2">
            <NavLink
              to="/dashboard"
              style={({ isActive }) => linkStyle({ isActive, disabled: !isLoggedIn })}
            >
              <Calendar size={18} />
              Dashboard
            </NavLink>

            <NavLink
              to="/manage-events"
              style={({ isActive }) => linkStyle({ isActive, disabled: !isLoggedIn })}
            >
              <Calendar size={18} />
              Manage Events
            </NavLink>

            <NavLink
              to="/attendees"
              style={({ isActive }) => linkStyle({ isActive, disabled: !isLoggedIn })}
            >
              <Users size={18} />
              Attendee Insights
            </NavLink>
          </div>
        )}
      </div>

      {/* ✅ ACCOUNT MANAGEMENT */}
      {isLoggedIn && (
        <div>
          <div
            className="d-flex justify-content-between align-items-center text-white"
            onClick={() => toggleSection("account")}
            style={{ cursor: "pointer" }}
          >
            <span className="fw-bold">Account Management</span>
            <ChevronDown
              size={18}
              className={openSections.account ? "rotate-180" : ""}
            />
          </div>

          {openSections.account && (
            <div className="mt-2 d-flex flex-column gap-2">
              <NavLink to="/manage-users" style={linkStyle({ isActive: false })}>
                <UserPlus size={18} />
                Manage Users
              </NavLink>

              <div
                onClick={onLogout}
                style={{
                  ...linkStyle({ isActive: false }),
                  cursor: "pointer",
                }}
              >
                <LogOut size={18} />
                Logout
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
