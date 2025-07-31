import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function ViewEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userValid, setUserValid] = useState(false);

  const token = localStorage.getItem("token");

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

  if (loading) return <p className="text-center mt-5">⏳ Loading event...</p>;
  if (!event) return <p className="text-center mt-5">❌ Event not found.</p>;

  return (
    <div>
      {/* ✅ HEADER */}
      <header
        style={{
          background: "#6C63FF",
          padding: "15px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#fff",
          position: "sticky",
          top: "0",
          zIndex: "10",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        {/* 🔹 Logo / Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/logo.png" alt="EventMate" style={{ height: "40px" }} />
          <h2 style={{ margin: 0, fontWeight: "bold" }}>EventMate</h2>
        </div>

        {/* 🔹 Nav Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}>Home</Link>
          <Link to="/events" style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}>Events</Link>

          {token ? (
            <button
              onClick={handleLogout}
              style={{
                background: "#fff",
                color: "#6C63FF",
                padding: "8px 15px",
                borderRadius: "8px",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
              }}
            >
              🚪 Logout
            </button>
          ) : (
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                background: "#fff",
                color: "#6C63FF",
                padding: "8px 15px",
                borderRadius: "8px",
                fontWeight: "600",
              }}
            >
              🔑 Login
            </Link>
          )}
        </nav>
      </header>

      {/* ✅ EVENT CONTENT */}
      <div className="container my-5">
        <div className="card shadow-lg border-0" style={{ borderRadius: "16px" }}>
          <img
            src={`http://localhost:5000/uploads/events/${event.image}`}
            alt={event.name}
            className="card-img-top"
            style={{ height: "400px", objectFit: "cover", borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }}
          />
          <div className="card-body">
            <h1 className="card-title fw-bold mb-3">{event.name}</h1>
            <p className="text-muted mb-2">📍 {event.location}</p>
            <p className="text-muted mb-2">📆 {new Date(event.date).toLocaleDateString()} – 🕒 {event.time}</p>
            <p className="card-text">{event.description}</p>

            {/* ✅ RSVP Button */}
            <button
              onClick={handleAttend}
              className="btn btn-success fw-semibold mt-3"
              style={{ padding: "12px 24px", borderRadius: "10px" }}
            >
              ✅ Attend Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewEventPage;
