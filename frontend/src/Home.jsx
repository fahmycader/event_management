import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import AOS from "aos";
import "aos/dist/aos.css";

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/events");
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
    AOS.init({ duration: 1000 });
  }, []);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null); // ✅ re-render header
    navigate("/login");
  };

  const totalEvents = events.length;
  const upcomingEvents = events.filter(
    (event) => new Date(event.date) > new Date()
  ).length;
  const completedEvents = totalEvents - upcomingEvents;

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
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
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)"
        }}
      >
        {/* 🔹 Logo / Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/logo.png" alt="EventMate" style={{ height: "40px" }} />
          <h2 style={{ margin: 0, fontWeight: "bold" }}>EventMate</h2>
        </div>

        {/* 🔹 Nav Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <Link
            to="/"
            style={{
              color: "#fff",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: "500"
            }}
          >
            Home
          </Link>

          <Link
            to="/events"
            style={{
              color: "#fff",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: "500"
            }}
          >
            Events
          </Link>

          {/* ✅ Login or Logout Button */}
          {token ? (
            <button
              onClick={handleLogout}
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "#fff",
                color: "#6C63FF",
                padding: "8px 15px",
                borderRadius: "8px",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                transition: "0.3s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f1f1")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              🚪 Logout
            </button>
          ) : (
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "#fff",
                color: "#6C63FF",
                padding: "8px 15px",
                borderRadius: "8px",
                fontWeight: "600",
                transition: "0.3s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f1f1")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              🔑 Login
            </Link>
          )}
        </nav>
      </header>
      <section
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div data-aos="fade-up">
          <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "10px" }}>
            Plan. Celebrate. Remember.
          </h1>
          <p style={{ fontSize: "18px" }}>
            Discover & manage events with ease — from birthdays to big weddings.
          </p>
        </div>
      </section>

      {/* ✅ Stats Section */}
      <section style={{ padding: "50px 20px", textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <div
            data-aos="fade-up"
            style={{
              background: "#f8f9fa",
              padding: "20px",
              borderRadius: "12px",
              width: "30%",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <h2>{totalEvents}</h2>
            <p>Total Events</p>
          </div>
          <div
            data-aos="fade-up"
            style={{
              background: "#f8f9fa",
              padding: "20px",
              borderRadius: "12px",
              width: "30%",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <h2>{upcomingEvents}</h2>
            <p>Upcoming</p>
          </div>
          <div
            data-aos="fade-up"
            style={{
              background: "#f8f9fa",
              padding: "20px",
              borderRadius: "12px",
              width: "30%",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <h2>{completedEvents}</h2>
            <p>Completed</p>
          </div>
        </div>
      </section>

      {/* ✅ Events Section */}
      <section style={{ padding: "40px 50px", background: "#f9f9f9" }}>
        <h2
          style={{
            marginBottom: "30px",
            fontSize: "28px",
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          📅 All Events
        </h2>

        {loading ? (
          <div style={{ textAlign: "center" }}>Loading events...</div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: "center" }}>No events available.</div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "25px",
            }}
          >
           {[...events]
  .sort((a, b) => new Date(b.date) - new Date(a.date)) // 🔽 Descending
  .slice(0, 6)
  .map((event) => {
    const eventDate = new Date(event.date);
    const today = new Date();
    let status = "";
    let badgeColor = "";
    let isCompleted = false;

    if (eventDate.toDateString() === today.toDateString()) {
      status = "Today";
      badgeColor = "#FFD700";
    } else if (eventDate > today) {
      status = "Upcoming";
      badgeColor = "#4CAF50";
    } else {
      status = "Completed";
      badgeColor = "#E53935";
      isCompleted = true;
    }

    return (
      <div
        key={event._id}
        data-aos="fade-up"
        style={{
          background: isCompleted ? "#f5f5f5" : "#fff",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          transition: "transform 0.3s ease",
          cursor: isCompleted ? "not-allowed" : "pointer",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          opacity: isCompleted ? 0.6 : 1,
          pointerEvents: isCompleted ? "none" : "auto",
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            src={`http://localhost:5000/uploads/events/${event.image}`}
            alt={event.name}
            style={{
              width: "100%",
              height: "180px",
              objectFit: "cover",
              filter: isCompleted ? "grayscale(80%)" : "none",
            }}
          />
          <span
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: badgeColor,
              color: "#fff",
              padding: "5px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            {status}
          </span>
        </div>

        <div style={{ padding: "15px", flex: "1" }}>
          <h3 style={{ marginBottom: "8px", fontSize: "20px" }}>
            {event.name}
          </h3>
          <p style={{ margin: "5px 0", color: "#555", fontSize: "14px" }}>
            📍 {event.location}
          </p>
          <p style={{ margin: "5px 0", color: "#555", fontSize: "14px" }}>
            📆 {new Date(event.date).toLocaleDateString()}
          </p>
          <p style={{ margin: "5px 0", color: "#555", fontSize: "14px" }}>
            🕒 {event.time}
          </p>
        </div>

        <div
          style={{
            borderTop: "1px solid #eee",
            padding: "12px",
            textAlign: "center",
            background: "#fafafa",
          }}
        >
          {isCompleted ? (
            <button
              disabled
              style={{
                width: "100%",
                background: "#ccc",
                color: "#fff",
                padding: "10px 0",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "not-allowed",
              }}
            >
              ❌ Completed
            </button>
          ) : (
            <Link to={`/event/${event._id}`} style={{ textDecoration: "none" }}>
              <button
                style={{
                  width: "100%",
                  background: "#6C63FF",
                  color: "#fff",
                  padding: "10px 0",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                👁 View
              </button>
            </Link>
          )}
        </div>
      </div>
    );
  })}

          </div>
        )}
      </section>

      {/* ✅ Footer */}
      <footer
        style={{
          marginTop: "50px",
          textAlign: "center",
          padding: "20px",
          background: "#f1f1f1",
        }}
      >
        <p>© {new Date().getFullYear()} EventMate. Crafted with ❤️</p>
      </footer>
    </div>
  );
}

export default Home;
