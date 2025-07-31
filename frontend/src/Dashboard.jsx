import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle} from "./componets/ui/card"
import DashboardLayout from "./componets/DashboardLayout";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { ChartRadialText } from "./componets/ui/ChartRadialText";
import {ChartPieSeparatorNone} from "./componets/ui/chart-pie-separator-none";

export default function Dashboard({ token, onLogout }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAttendees, setTotalAttendees] = useState(0);

  // ✅ Fetch events on load
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("http://localhost:5000/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);

        // ✅ calculate total attendees
        const total = Array.isArray(data)
          ? data.reduce((acc, event) => acc + (event.rsvps ? event.rsvps.length : 0), 0)
          : 0;
        setTotalAttendees(total);
      } catch (err) {
        console.error("❌ Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [token]);

  // ✅ Mock Data for Charts
  const pieData = [
    { name: "Event A", value: 450 },
    { name: "Event B", value: 250 },
    { name: "Event C", value: 290 },
    { name: "Event D", value: 370 },
    { name: "Event E", value: 170 },
  ];
  const COLORS = ["#5A37F1", "#34C759", "#FF9500", "#FF2D55", "#5856D6"];

  return (
    <DashboardLayout onLogout={onLogout}>
   <div className="container py-4 bg-light min-vh-100">
  {/* ✅ Top Bento Grid */}
  <div className="row g-4">

    {/* 🔵 Total Events */}
    <div className="col-12 col-lg-3">
      <div 
        className="p-4 rounded shadow text-white h-100" 
        style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
      >
        <div className="small fw-medium opacity-75">📅 Total Events</div>
        <h2 className="display-6 fw-bold mt-2">{events.length}</h2>
        <p className="small opacity-75 mb-0">All created events</p>
      </div>
    </div>

    {/* 🟢 Total Attendees */}
    <div className="col-12 col-lg-3">
      <div 
        className="p-4 rounded shadow text-white h-100" 
        style={{ background: "linear-gradient(135deg, #10B981, #ffffff)" }}
      >
        <div className="small fw-medium opacity-75">👥 Total Attendees</div>
        <h2 className="display-6 fw-bold mt-2">{totalAttendees}</h2>
        <p className="small opacity-75 mb-0">All registered attendees</p>
      </div>
    </div>

    {/* 🟣 Pie Chart */}
    <div className="col-12 col-lg-3">
      <div className="card shadow h-100">
        <div className="card-body">
          <ChartPieSeparatorNone />
        </div>
      </div>
    </div>

    {/* 🔴 Radial Chart */}
    <div className="col-12 col-lg-3">
      <div className="card shadow h-100">
        <div className="card-body">
          <ChartRadialText />
        </div>
      </div>
    </div>
  </div>

  {/* ✅ Bottom Section – 2-column layout */}
  <div className="row g-4 mt-4">

    {/* Upcoming Events */}
    <div className="col-12 col-lg-6">
      <div className="card shadow h-100">
        <div className="card-header bg-white">
          <h6 className="card-title text-muted mb-0">📌 Upcoming Events</h6>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Loading...</p>
          ) : events.length === 0 ? (
            <p>No events available.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {events.slice(0, 5).map((ev) => (
                <li
                  key={ev._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span className="fw-medium">{ev.name}</span>
                  <span className="text-muted small">
                    {new Date(ev.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>

    {/* Notifications */}
    <div className="col-12 col-lg-6">
      <div className="card shadow h-100">
        <div className="card-header bg-white">
          <h6 className="card-title text-muted mb-0">🔔 Notifications</h6>
        </div>
        <div className="card-body">
          <ul className="list-unstyled small mb-0">
            <li>✅ Paycheck released for artists @Wayo Event</li>
            <li>💰 Total revenue transferred to bank</li>
            <li>🎉 Alan Walker event in 3 days</li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</div>

    </DashboardLayout>
  );
}
