import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Home as HomeIcon,
  Calendar,
  Phone,
  MapPin,
  CalendarDays,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ViewEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userValid, setUserValid] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Style objects for reuse
  const navLinkStyle = {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "15px",
    transition: "opacity 0.2s",
  };

  const logoutButtonStyle = {
    background: "#fff",
    color: "#6C63FF",
    padding: "8px 15px",
    borderRadius: "8px",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
  };

  const loginButtonStyle = {
    textDecoration: "none",
    background: "#6C63FF",
    color: "#fff",
    padding: "8px 15px",
    borderRadius: "8px",
    fontWeight: "600",
  };

  // ✅ Validate token
  useEffect(() => {
    async function validateUser() {
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/auth/validate", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          setUserValid(true);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          toast.error("⚠️ Session expired. Please log in again.");
          setUserValid(false);
        }
      } catch (err) {
        console.error("❌ Error validating user:", err);
        setUserValid(false);
      }
    }

    validateUser();
  }, [token]);

  // ✅ Fetch event details
  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${id}`);
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error("❌ Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  // ✅ RSVP Handler
  const handleAttend = async () => {
    if (!token || !userValid) {
      localStorage.setItem("pendingEvent", id);
      toast.error("⚠️ Please log in to attend this event.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Going" }),
      });

      if (!res.ok) {
        const errData = await res.json();
        toast.error(`❌ RSVP failed: ${errData.error || "Unknown error"}`);
        return;
      }

      toast.success("🎉 RSVP successful!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("❌ RSVP error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // ✅ Loading / Error states
  if (loading) return <p className="text-center mt-5">⏳ Loading event...</p>;
  if (!event) return <p className="text-center mt-5">❌ Event not found.</p>;

  return (
    <div
      style={{
        fontFamily: "SF Pro Display, sans-serif",
        background: "#f5f5f7",
        minHeight: "100vh",
      }}
    >
      {/* ✅ HEADER */}
      <header
        style={{
          background: "linear-gradient(90deg, #6C63FF 0%, #8B80FF 100%)",
          padding: "18px 50px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#fff",
          position: "sticky",
          top: "0",
          zIndex: "1000",
          boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* 🔹 Logo + Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/logo.png"
            alt="EventMate"
            style={{
              height: "45px",
              width: "45px",
              borderRadius: "50%",
              background: "#fff",
              padding: "5px",
            }}
          />
          <h2
            style={{
              margin: 0,
              fontWeight: "700",
              fontSize: "22px",
              letterSpacing: "1px",
            }}
          >
            EventMate
          </h2>
        </div>

        {/* 🔹 Navigation Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "35px" }}>
          <Link to="/" style={navLinkStyle}>
            <HomeIcon size={18} /> Home
          </Link>

          <Link to="/events" style={navLinkStyle}>
            <Calendar size={18} /> Events
          </Link>

          <a href="#contact" style={navLinkStyle}>
            <Phone size={18} /> Contact Us
          </a>
        </nav>

        {/* 🔹 Login or Logout Button */}
        {token ? (
          <button
            onClick={handleLogout}
            style={logoutButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f1f1")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            style={loginButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.color = "#6C63FF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#6C63FF";
              e.currentTarget.style.color = "#fff";
            }}
          >
            Login
          </Link>
        )}
      </header>

      {/* ✅ MAIN CONTENT */}
      <div className="container py-5">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
            alignItems: "start",
            background: "white",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          {/* ✅ Left Side: Event Image */}
          <div>
            <img
              src={`http://localhost:5000/uploads/events/${event.image}`}
              alt={event.name}
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
          </div>

          {/* ✅ Right Side: Event Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h1 style={{ fontWeight: "700", fontSize: "28px", marginBottom: "10px" }}>
              {event.name}
            </h1>

            {/* ✅ Location */}
            <p
              style={{
                fontSize: "16px",
                color: "#555",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <MapPin size={18} color="#6C63FF" /> {event.location}
            </p>

            {/* ✅ Date & Time */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <p
                style={{
                  fontSize: "16px",
                  color: "#555",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <CalendarDays size={18} color="#6C63FF" />{" "}
                {new Date(event.date).toLocaleDateString("en-GB")}
              </p>
              <p
                style={{
                  fontSize: "16px",
                  color: "#555",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Clock size={18} color="#6C63FF" /> {event.time}
              </p>
            </div>

            {/* ✅ Description */}
            <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#333" }}>
              {event.description}
            </p>

            {/* ✅ RSVP Button */}
            <button
              onClick={handleAttend}
              style={{
                background: "#007aff",
                color: "white",
                padding: "14px 24px",
                fontSize: "16px",
                fontWeight: "600",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                marginTop: "20px",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#005bb5")}
              onMouseOut={(e) => (e.target.style.background = "#007aff")}
            >
              Attend Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
