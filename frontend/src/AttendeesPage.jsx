import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AttendeesPage({ token }) {
  const { id } = useParams();
  const [attendees, setAttendees] = useState([]);
  const [notAttendees, setNotAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttendees() {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${id}/attendees`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Unauthorized or failed fetch");

        const data = await res.json();
        setAttendees(data.attendees || []);
        setNotAttendees(data.notAttendees || []);
      } catch (err) {
        console.error("❌ Error fetching attendees:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchAttendees();
  }, [id, token]);

  if (loading) return <p className="text-center">Loading attendees...</p>;

  return (
    <div className="container py-4">
      <h1 className="mb-4">🎉 Attendees List</h1>

      {/* ✅ Yes / Going */}
      <h3>✅ Attending ({attendees.length})</h3>
      <ul className="list-group mb-4">
        {attendees.length === 0 ? (
          <li className="list-group-item">No one attending yet.</li>
        ) : (
          attendees.map((person, idx) => (
            <li key={idx} className="list-group-item">
              {person.email || "⚠️ No Email Provided"}
            </li>
          ))
        )}
      </ul>

      {/* ❌ No */}
      <h3>❌ Not Attending ({notAttendees.length})</h3>
      <ul className="list-group">
        {notAttendees.length === 0 ? (
          <li className="list-group-item">No declines yet.</li>
        ) : (
          notAttendees.map((person, idx) => (
            <li key={idx} className="list-group-item">
              {person.email || "⚠️ No Email Provided"}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
