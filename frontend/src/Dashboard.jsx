import { useEffect, useState } from "react";
import DashboardLayout from "./componets/DashboardLayout";
import FilterCard from "./componets/filter-card";

function Dashboard({ token, onLogout }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/events", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [token]);

  return (
    <DashboardLayout onLogout={onLogout}>
    <FilterCard/>

      {loading ? (
        <div>Loading...</div>
      ) : events.length === 0 ? (
        <div>No events yet.</div>
      ) : (
        <table className="table table-bordered table-striped" style={{ maxWidth: "900px" }}>
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>RSVPs</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev._id}>
                <td>{ev.name}</td>
                <td>{ev.date}</td>
                <td>{ev.rsvps ? ev.rsvps.length : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;
