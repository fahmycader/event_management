import { useState } from "react";
import { Search, Calendar, CirclePlus } from "lucide-react";

export default function FilterHeader({ onSearch, onFilter, onDate }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
    if (onFilter) onFilter(e.target.value);
  };

  const handleDate = (e) => {
    setDate(e.target.value);
    if (onDate) onDate(e.target.value);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-between p-3 mb-4 shadow-sm bg-white rounded"
      style={{ border: "none" }}
    >
      {/* ✅ LEFT SECTION: Title + Buttons */}
     
        <h5 className="fw-bold text-primary mb-0">Event Management Section</h5>
        <div className="d-flex align-items-center gap-3">
        {/* ➕ New Event Button */}
        <button
  className="btn btn-primary d-flex align-items-center gap-2 fw-semibold"
  onClick={() => window.location.href = "/add-events"}
>
  <CirclePlus size={18} /> New Event
</button>

        {/* 📊 Attendee Insights Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-outline-secondary dropdown-toggle fw-semibold"
            type="button"
            data-bs-toggle="dropdown"
          >
            Attendee Insights
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#">Top Attendees</a></li>
            <li><a className="dropdown-item" href="#">Engagement Stats</a></li>
            <li><a className="dropdown-item" href="#">Export Data</a></li>
          </ul>
        </div>
      </div>

      {/* ✅ RIGHT SECTION: Search + Filters */}
      <div className="d-flex align-items-center gap-3">
        {/* 🔍 Search Bar */}
        <div
          className="d-flex align-items-center px-3 rounded"
          style={{
            backgroundColor: "#f4f2ff",
            height: "45px",
            borderRadius: "25px",
          }}
        >
          <Search size={18} className="text-muted" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleSearch}
            className="border-0 bg-transparent ms-2"
            style={{
              outline: "none",
              width: "160px",
              fontSize: "14px",
              background: "transparent",
            }}
          />
        </div>

        {/* 🔽 Sort Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-outline-secondary dropdown-toggle fw-semibold"
            type="button"
            data-bs-toggle="dropdown"
          >
            Sort By: Status
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#">Upcoming</a></li>
            <li><a className="dropdown-item" href="#">Pending</a></li>
            <li><a className="dropdown-item" href="#">Closed</a></li>
          </ul>
        </div>

        {/* 📅 Date Picker */}
        <div
          className="d-flex align-items-center border rounded px-3"
          style={{
            height: "45px",
            borderRadius: "25px",
          }}
        >
          <Calendar size={18} className="text-muted" />
          <input
            type="date"
            value={date}
            onChange={handleDate}
            className="border-0 bg-transparent ms-2"
            style={{
              outline: "none",
              fontSize: "14px",
              background: "transparent",
            }}
          />
        </div>
      </div>
    </div>
  );
}
