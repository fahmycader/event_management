import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Calendar,
  Ticket,
  Users,
  BarChart2,
  Headphones,
  Bell,
  Settings,
  Megaphone,
  Folder,
  UserPlus,
  LogOut,
  PlusCircle,
  ChevronDown,
} from "lucide-react";

const Sidebar = ({ onLogout }) => {
  const [openSections, setOpenSections] = useState({
    main: true,
    support: true,
    additional: true,
    account: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "8px",
    textDecoration: "none",
    color: isActive ? "#5A37F1" : "white",
    backgroundColor: isActive ? "white" : "transparent",
    fontWeight: isActive ? "600" : "400",
  });

  return (
    <div
      className="d-flex flex-column"
      style={{
        width: "260px",
        minHeight: "100vh",
        backgroundColor: "#5A37F1",
        padding: "20px",
        borderTopRightRadius: "20px",
        borderBottomRightRadius: "20px",
      }}
    >
      {/* ✅ Logo + Title */}
      <div className="mb-4 d-flex align-items-center gap-2">
  <img src="/logo.png" alt="Eventure" style={{ height: "40px" }} />
  <h4 className="fw-bold text-white mb-0">Eventure</h4>
</div>


      {/* ✅ Add Quick Event */}
      <button
        className="btn btn-light d-flex align-items-center gap-2 mb-3 fw-semibold"
        style={{ color: "#5A37F1" }}
      >
        <PlusCircle size={20} />
        Add Quick Event
      </button>

      <hr className="border-light opacity-25" />

      {/* ✅ MAIN NAVIGATION */}
      <div className="mb-3">
        <div
          className="d-flex justify-content-between align-items-center text-white"
          onClick={() => toggleSection("main")}
          style={{ cursor: "pointer" }}
        >
          <span className="fw-bold">Main Navigation</span>
          <ChevronDown size={18} className={openSections.main ? "rotate-180" : ""} />
        </div>

        {openSections.main && (
          <div className="mt-2 d-flex flex-column gap-2">
            <NavLink to="/dashboard" style={linkStyle}>
              <Calendar size={18} />
              Dashboard
            </NavLink>

            <NavLink to="/manage-events" style={linkStyle}>
              <Calendar size={18} />
              Manage Events
            </NavLink>

            <NavLink to="/bookings" style={linkStyle}>
              <Ticket size={18} />
              Booking & Tickets
            </NavLink>

            <NavLink to="/attendees" style={linkStyle}>
              <Users size={18} />
              Attendee Insights
            </NavLink>

            <NavLink to="/analytics" style={linkStyle}>
              <BarChart2 size={18} />
              Analytics & Reports
            </NavLink>
          </div>
        )}
      </div>

      {/* ✅ SUPPORT AND SETTINGS */}
      <div className="mb-3">
        <div
          className="d-flex justify-content-between align-items-center text-white"
          onClick={() => toggleSection("support")}
          style={{ cursor: "pointer" }}
        >
          <span className="fw-bold">Support And Settings</span>
          <ChevronDown size={18} className={openSections.support ? "rotate-180" : ""} />
        </div>

        {openSections.support && (
          <div className="mt-2 d-flex flex-column gap-2">
            <NavLink to="/support" style={linkStyle}>
              <Headphones size={18} />
              Contact Support
            </NavLink>

            <NavLink to="/notifications" style={linkStyle}>
              <Bell size={18} />
              Notifications
            </NavLink>

            <NavLink to="/settings" style={linkStyle}>
              <Settings size={18} />
              Settings
            </NavLink>
          </div>
        )}
      </div>

      {/* ✅ ADDITIONAL ITEMS */}
      <div className="mb-3">
        <div
          className="d-flex justify-content-between align-items-center text-white"
          onClick={() => toggleSection("additional")}
          style={{ cursor: "pointer" }}
        >
          <span className="fw-bold">Additional Items</span>
          <ChevronDown size={18} className={openSections.additional ? "rotate-180" : ""} />
        </div>

        {openSections.additional && (
          <div className="mt-2 d-flex flex-column gap-2">
            <NavLink to="/marketing" style={linkStyle}>
              <Megaphone size={18} />
              Marketing
            </NavLink>

            <NavLink to="/event-categories" style={linkStyle}>
              <Folder size={18} />
              Event Categories
            </NavLink>
          </div>
        )}
      </div>

      {/* ✅ ACCOUNT MANAGEMENT */}
      <div>
        <div
          className="d-flex justify-content-between align-items-center text-white"
          onClick={() => toggleSection("account")}
          style={{ cursor: "pointer" }}
        >
          <span className="fw-bold">Account Management</span>
          <ChevronDown size={18} className={openSections.account ? "rotate-180" : ""} />
        </div>

        {openSections.account && (
          <div className="mt-2 d-flex flex-column gap-2">
            <NavLink to="/manage-users" style={linkStyle}>
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
    </div>
  );
};

export default Sidebar;
