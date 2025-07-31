import { useEffect, useState } from "react";
import FilterCard from "./componets/filter-card";
import DashboardLayout from "./componets/DashboardLayout";

export default function EventAttendees({ token, onLogout }) {
  const [attendees, setAttendees] = useState([]);
  const [notAttendees, setNotAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    async function fetchAllAttendees() {
      try {
        const res = await fetch("http://localhost:5000/api/events/attendees/all", {
          headers: {
            Authorization: `Bearer ${token}`,  // ✅ send token for security
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch attendees");
        }

        const data = await res.json();
        setAttendees(data.attendees || []);
        setNotAttendees(data.notAttendees || []);
      } catch (err) {
        console.error("❌ Error fetching all attendees:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllAttendees();
  }, [token]);

  if (loading) return <p className="text-center mt-5">Loading attendees...</p>;

  return (
  
   <DashboardLayout onLogout={onLogout}>
  <FilterCard
        onSearch={(value) => setSearch(value)}
        onFilter={(value) => setFilter(value)}
        onDate={(value) => setDate(value)}
      />
    {/* 🔹 Page Title */}
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h1 className="fw-bold text-dark">🎉 All Event Attendees</h1>
     
    </div>

    {/* ✅ Attendees Table */}
    <div className="card shadow border-0 mb-4" style={{ borderRadius: "16px" }}>
      <div
        className="card-header text-white fw-bold"
        style={{ backgroundColor: "#6366F1", borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }}
      >
        ✅ Attending ({attendees.length})
      </div>
      <div className="card-body p-0">
        <table className="table align-middle mb-0">
          <thead style={{ backgroundColor: "#f9fafb" }}>
            <tr>
              <th className="py-3 px-3"> Event</th>
              <th className="py-3 px-3"> Email</th>
              <th className="py-3 px-3"> Status</th>
            </tr>
          </thead>
          <tbody>
            {attendees.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-muted py-4">No attendees yet.</td>
              </tr>
            ) : (
              attendees.map((person, idx) => (
                <tr key={idx} className="hover-row">
                  <td className="fw-semibold px-3">{person.event}</td>
                  <td className="text-muted px-3">{person.email}</td>
                  <td className="px-3">
                    <span className="badge rounded-pill" style={{ backgroundColor: "#6366F1" }}>
                      {person.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* ❌ Not Attending Table */}
    <div className="card shadow border-0" style={{ borderRadius: "16px" }}>
      <div
        className="card-header text-white fw-bold"
        style={{ backgroundColor: "#EF4444", borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }}
      >
        ❌ Not Attending ({notAttendees.length})
      </div>
      <div className="card-body p-0">
        <table className="table align-middle mb-0">
          <thead style={{ backgroundColor: "#f9fafb" }}>
            <tr>
              <th className="py-3 px-3"> Event</th>
              <th className="py-3 px-3"> Email</th>
              <th className="py-3 px-3"> Status</th>
            </tr>
          </thead>
          <tbody>
            {notAttendees.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-muted py-4">No declines yet.</td>
              </tr>
            ) : (
              notAttendees.map((person, idx) => (
                <tr key={idx} className="hover-row">
                  <td className="fw-semibold px-3">{person.event}</td>
                  <td className="text-muted px-3">{person.email}</td>
                  <td className="px-3">
                    <span className="badge rounded-pill bg-danger">
                      {person.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  
</DashboardLayout>

  );
}
