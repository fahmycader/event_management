import { useEffect, useState } from "react";
import DashboardLayout from "./componets/DashboardLayout";
import FilterCard from "./componets/filter-card";
import EventCard from "./componets/Event-card";


function Dashboard({ token, onLogout }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [date, setDate] = useState("");
 

  console.log("--->", token)
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

  // ✅ Filter events based on search, filter & date
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? event.status === filter : true;
    const matchesDate = date ? event.date === date : true;
    return matchesSearch && matchesFilter && matchesDate;
  });

  return (
    <DashboardLayout onLogout={onLogout}>
      {/* ✅ Filter Card */}
      <FilterCard
        onSearch={(value) => setSearch(value)}
        onFilter={(value) => setFilter(value)}
        onDate={(value) => setDate(value)}
      />

      {/* ✅ Loading State */}
      {loading ? (
        <div>Loading...</div>
      ) : filteredEvents.length === 0 ? (
        <div>No events yet.</div>
      ) : (
        <div className="row g-4">
          {filteredEvents.map((event) => (
            <div className="col-md-4" key={event._id}>
              <EventCard
              id={event._id}  
                name={event.name}
                date={event.date}
                time={event.time}
                location={event.location}
                description={event.description}
                invitees={event.invitees}
                rsvps={event.rsvps}
         

                image={`http://localhost:5000/uploads/events/${event.image}`}   //  Full URL for React
/>
              
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;
