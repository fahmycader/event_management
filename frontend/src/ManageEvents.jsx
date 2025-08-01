import { useEffect, useState } from "react";
import DashboardLayout from "./componets/DashboardLayout";
import FilterCard from "./componets/filter-card";
import EventCard from "./componets/Event-card";

function Dashboard({ token, onLogout }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(""); // "Upcoming" | "Today" | "Completed"
  const [date, setDate] = useState("");

  // ✅ Fetch events from API
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });

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
  }, [token]);

  // ✅ Helper to determine event status
  const getEventStatus = (eventDate) => {
    const today = new Date();
    const eventDay = new Date(eventDate);

    if (eventDay.toDateString() === today.toDateString()) return "Today";
    if (eventDay > today) return "Upcoming";
    return "Completed";
  };

  // ✅ Filter events based on search, filter & date
  const filteredEvents = events.filter((event) => {
    const eventStatus = getEventStatus(event.date);

    // ✅ SEARCH MATCH – Name, Location, or Description
    const matchesSearch =
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(search.toLowerCase()));

    // ✅ STATUS FILTER – Only match if filter is applied
    const matchesFilter = filter ? eventStatus === filter : true;

    // ✅ DATE FILTER – Convert event.date to YYYY-MM-DD
    const eventDateFormatted = new Date(event.date).toISOString().split("T")[0];
    const matchesDate = date ? eventDateFormatted === date : true;

    return matchesSearch && matchesFilter && matchesDate;
  });

  return (
    <DashboardLayout onLogout={onLogout}>
      {/* ✅ Filter/Search Card */}
      <FilterCard
        onSearch={(value) => setSearch(value)}
        onFilter={(value) => setFilter(value)}
        onDate={(value) => setDate(value)}
      />

      {/* ✅ Loading State */}
      {loading ? (
        <div className="text-center mt-4">Loading events...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center mt-4">No events found.</div>
      ) : (
        <div className="row g-4 mt-3">
          {filteredEvents.map((event) => (
            <div className="col-md-4" key={event._id}>
              <EventCard
                id={event._id}
                name={event.name}
                date={event.date}
                time={event.time}
                price={event.price}
                seats={event.seats}
                location={event.location}
                description={event.description}
                invitees={event.invitees}
                rsvps={event.rsvps}
                image={`http://localhost:5000/uploads/events/${event.image}`}
              />
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;
