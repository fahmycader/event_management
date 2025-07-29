import { useState } from "react";

export default function FilterCard({ onSearch, onFilter, onDate }) {
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
    <div className="card border-none bg-white shadow-sm p-3 mb-4">
      <h5 className="card-title mb-3 fw-bold text-primary">Event Management Section</h5>

      <div className="row g-3">
        {/* ✅ Search */}
        <div className="col-md-4">
          <label className="form-label fw-semibold">Search</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search events..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        {/* ✅ Filter Dropdown */}
        <div className="col-md-4">
          <label className="form-label fw-semibold">Filter</label>
          <select
            className="form-select"
            value={filter}
            onChange={handleFilter}
          >
            <option value="">Select filter</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* ✅ Date Picker */}
        <div className="col-md-4">
          <label className="form-label fw-semibold">Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={handleDate}
          />
        </div>
      </div>
    </div>
  );
}
