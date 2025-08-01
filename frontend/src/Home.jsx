import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { CalendarDays, ArrowLeft, ArrowRight, Users, Home as HomeIcon, Calendar, Phone } from "lucide-react";
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
  const upcomingEventsRef = useRef(null);
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

  const scrollToUpcomingEvents = () => {
    upcomingEventsRef.current?.scrollIntoView({ behavior: "smooth" });
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
          <h2 style={{ margin: 0, fontWeight: "700", fontSize: "22px", letterSpacing: "1px" }}>
            EventMate
          </h2>
        </div>

        {/* 🔹 Navigation Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "35px" }}>
          <Link
            to="/"
            style={navLinkStyle}
          >
            <HomeIcon size={18} /> Home
          </Link>

          {/* ✅ Clicking this will scroll to section */}
          <span
            style={{ ...navLinkStyle, cursor: "pointer" }}
            onClick={scrollToUpcomingEvents}
          >
            <Calendar size={18} /> Events
          </span>

          <a href="#contact"
            style={navLinkStyle}>
            <Phone size={18} /> Contact Us
          </a>
        </nav>

        {/* 🔹 Login or Logout Button */}
        {token ? (
          <button
            onClick={handleLogout}
            style={logoutButtonStyle}
            onMouseEnter={(e) => e.currentTarget.style.background = "#f1f1f1"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
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
      <section
  className="py-5"

>
  <div className="container py-5">
    <div className="row align-items-center g-5">

      {/* ✅ LEFT SIDE CONTENT */}
      <div className="col-lg-6" data-aos="fade-right">
  <h1
    className="fw-bold mb-4"
    style={{ fontSize: "50px", lineHeight: 1.2 }}
  >
    Plan. Host. <br /> Celebrate Your <br /> Events with{" "}
    <span style={{ color: "#6C63FF" }}>EventMate</span>
  </h1>

  <p
    className="text-muted mb-5"
    style={{ fontSize: "20px", maxWidth: "500px" }}
  >
    EventMate is your all-in-one event management platform. we make planning simple,
    managing smooth, and attending effortless. Discover, create, and share events
    that bring people together.
  </p>

  {/* ✅ BUTTONS */}
  <div className="d-flex gap-4">
    <button
      className="btn px-4 py-3 text-white shadow"
      style={{
        backgroundColor: "#6C63FF",
        borderRadius: "10px",
        fontSize: "18px",
      }}
    >
       Create an Event
    </button>
    <button
      className="btn px-4 py-3 shadow-sm"
      style={{
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        borderRadius: "10px",
        fontSize: "18px",
      }}
    >
       Find an Event
    </button>
  </div>
</div>


      {/* ✅ RIGHT SIDE IMAGE & FLOATING CARDS */}
      <div className="col-lg-6 d-flex justify-content-center">
        <div className="position-relative d-inline-block" data-aos="zoom-in">
          {/* 🌟 Main Image */}
          <img
  src="banner.jpg"
  alt="Happy Person"
  className="img-fluid"
  style={{
    width: "1000px",   // ⬆️ Increased size
    maxWidth: "100%",  // ✅ Keeps it responsive for smaller screens
    borderRadius: "16px",
    boxShadow: "0px 8px 25px rgba(0,0,0,0.1)",
  }}
/>
          {/* 🎉 Floating Card 1 */}
        
          {/* 🎉 Floating Card 2 */}
          <div
            className="position-absolute bg-white shadow-lg p-3 rounded"
            style={{
              bottom: "30px",
              right: "30px",
              width: "180px",
              borderRadius: "12px",
            }}
            data-aos="fade-up-left"
          >
            <h6 className="fw-bold mb-1">Build Career</h6>
            <a
              href="#"
              className="text-decoration-none fw-semibold"
              style={{ color: "#6C63FF" }}
            >
              Join Group
            </a>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>




      {/* ✅ Stats Section */}
      <section style={{ padding: "20px ", textAlign: "center" }}>
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
  className="btn px-4 py-3 text-white shadow"
  style={{
    backgroundColor: "#6C63FF",
    padding: "20px",
    borderRadius: "12px",
    width: "30%",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
    fontSize: "18px",
  }}
>
  <h2>{completedEvents}</h2>
  <p>Completed</p>
</div>

        </div>
      </section>


      <section ref={upcomingEventsRef} style={{ padding: "50px 40px", background: "#fff" }}>
  {/* ✅ Section Header */}
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
    <h2 style={{ fontSize: "28px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
      <CalendarDays size={22} color="#6C63FF" /> Upcoming Events
    </h2>
    <div style={{ display: "flex", gap: "15px", fontSize: "20px", cursor: "pointer" }}>
      <ArrowLeft size={22} color="#6C63FF" />
      <ArrowRight size={22} color="#6C63FF" />
    </div>
  </div>

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
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // 🔽 DESCENDING order (latest first)
        .slice(0, 6)
        .map((event) => {
          const eventDate = new Date(event.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // normalize today for comparison

          let status = "";
          let badgeColor = "";

          if (eventDate < today) {
            status = " Completed";
            badgeColor = "#6c757d"; // gray
          } else if (eventDate.toDateString() === today.toDateString()) {
            status = " Happening Soon";
            badgeColor = "#ff9800"; // orange
          } else {
            status = "Upcoming";
            badgeColor = "#4caf50"; // green
          }

          const formattedDate = eventDate.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });

          return (
            <div
              key={event._id}
              data-aos="fade-up"
              style={{
                background: "#fff",
                borderRadius: "16px",
                boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.08)",
                overflow: "hidden",
                transition: "transform 0.3s ease",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                opacity: status === " Completed" ? 0.7 : 1, // faded if completed
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {/* ✅ Event Image */}
              <div style={{ position: "relative" }}>
                <img
                  src={`http://localhost:5000/uploads/events/${event.image}`}
                  alt={event.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    filter: status === " Completed" ? "grayscale(70%)" : "none",
                  }}
                />
                {/* ✅ Status Badge */}
                <span
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    background: badgeColor,
                    color: "#fff",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {status}
                </span>

                {/* ✅ Date Badge */}
                <span
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    background: "#6C63FF",
                    color: "#fff",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <CalendarDays size={14} /> {formattedDate} | {event.time}
                </span>
              </div>

              {/* ✅ Event Details */}
              <div style={{ padding: "15px" }}>
                <h3 style={{ marginBottom: "8px", fontSize: "20px", fontWeight: "700" }}>
                  {event.name}
                </h3>
                <p style={{ margin: "5px 0 15px", color: "#555", fontSize: "14px" }}>
                  {event.description?.slice(0, 70) || "Join us for an exciting event and network with others!"}
                </p>

                {/* ✅ Footer: avatars + more details */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" style={{ width: "28px", height: "28px", borderRadius: "50%", marginLeft: "-5px" }} />
  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" style={{ width: "28px", height: "28px", borderRadius: "50%", marginLeft: "-5px" }} />
  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie" style={{ width: "28px", height: "28px", borderRadius: "50%", marginLeft: "-5px" }} />
  <span style={{ fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "5px" }}>
    <Users size={14} color="#6C63FF" /> 50+
  </span>
</div>
                  <Link
                    to={`/event/${event._id}`}
                    style={{ textDecoration: "none", fontSize: "14px", fontWeight: "600", color: "#6C63FF" }}
                  >
                    More Details →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  )}
</section>


 {/* ✅ CONTACT US SECTION */}
 <section id="contact" style={{ background: "#f8f9fa", padding: "60px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "30px", fontWeight: "700", color: "#6C63FF", marginBottom: "20px" }}>
          Contact Us
        </h2>
        <p style={{ maxWidth: "500px", margin: "0 auto", color: "#555", marginBottom: "30px" }}>
          Got a question, feedback, or partnership inquiry? Reach out to us and we’ll get back to you.
        </p>
        <form style={{ maxWidth: "600px", margin: "0 auto" }}>
          <input type="text" placeholder="Your Name" style={inputStyle} required />
          <input type="email" placeholder="Your Email" style={inputStyle} required />
          <textarea placeholder="Your Message" rows="4" style={{ ...inputStyle, height: "120px" }} required></textarea>
          <button type="submit" style={contactButton}>Send Message</button>
        </form>
      </section>

      {/* ✅ Footer */}
      <footer
  style={{
    marginTop: "50px",
    textAlign: "center",
    padding: "20px",
    textDecoration: "underline",  
  }}
>
  <p>© {new Date().getFullYear()} EventMate.</p>
</footer>

    </div>
  );
}

export default Home;




/* ✅ Styles */
const navLinkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: "500",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  transition: "color 0.3s ease",
};

const loginButtonStyle = {
  background: "#6C63FF",
  color: "#fff",
  padding: "10px 22px",
  borderRadius: "50px",
  fontWeight: "700",
  fontSize: "15px",
  textDecoration: "none",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
  transition: "all 0.3s ease",
};

const logoutButtonStyle = {
  background: "#fff",
  color: "#6C63FF",
  padding: "10px 20px",
  borderRadius: "50px",
  border: "none",
  fontWeight: "600",
  fontSize: "15px",
  cursor: "pointer",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
  transition: "all 0.3s ease",
};

const primaryButton = {
  backgroundColor: "#6C63FF",
  borderRadius: "10px",
  fontSize: "18px",
};

const secondaryButton = {
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "10px",
  fontSize: "18px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const contactButton = {
  background: "#6C63FF",
  color: "#fff",
  padding: "12px 25px",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "16px",
};
