import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Image as ImageIcon } from "lucide-react";
import DashboardLayout from "./componets/DashboardLayout";

export default function EditEvent({ token, onLogout }) {
  const { id } = useParams(); // ✅ Get event ID from URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    description: "",
    price: "",
    seats: "",
    tags: "",
  });

  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH EVENT DETAILS BY ID
  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch event");

        const data = await res.json();

        setForm({
          name: data.name || "",
          date: data.date || "",
          time: data.time || "",
          location: data.location || "",
          description: data.description || "",
          price: data.price || "",
          seats: data.seats || "",
          tags: data.tags || "",
        });

        if (data.image) {
          setPreview(`http://localhost:5000/uploads/events/${data.image}`);
        }
      } catch (err) {
        console.error("❌ Error loading event:", err);
        alert("❌ Could not load event details");
      }
    }

    fetchEvent();
  }, [id, token]);

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ HANDLE IMAGE UPLOAD
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); // ✅ Show preview before save
    }
  };

  // ✅ UPDATE EVENT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update event");

      alert("✅ Event updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("❌ Error updating event");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE EVENT
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete event");

      alert("✅ Event deleted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting event");
    }
  };

  return (
    <DashboardLayout onLogout={onLogout}>
         <div className="card shadow-sm border-0 h-90"
      style={{ borderRadius: "16px", overflow: "hidden", padding: "16px" }}>
      <h3 className="fw-bold text-primary mb-4">✏️ Edit Event</h3>
      </div>
      <div className="mb-4"></div>
      <div className="card shadow-sm border-0 h-90"
      style={{ borderRadius: "16px", overflow: "hidden", padding: "16px" }}>
      <form onSubmit={handleSubmit} className="row g-4">
        {/* ✅ IMAGE UPLOAD */}
        <div className="col-md-4 text-center">
          <div className="border rounded p-3" style={{ height: "250px" }}>
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="img-fluid rounded"
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
            ) : (
              <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted">
                <ImageIcon size={40} />
                <span>Upload Event Image</span>
              </div>
            )}
            <input
              type="file"
              className="form-control mt-2"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* ✅ EVENT DETAILS */}
        <div className="col-md-8">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Event Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Event Date</label>
              <div className="input-group">
                <span className="input-group-text"><Calendar size={16} /></span>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Event Time</label>
              <div className="input-group">
                <span className="input-group-text"><Clock size={16} /></span>
                <input
                  type="time"
                  className="form-control"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-12">
              <label className="form-label fw-semibold">Event Venue</label>
              <div className="input-group">
                <span className="input-group-text"><MapPin size={16} /></span>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-12">
              <label className="form-label fw-semibold">Event Description</label>
              <textarea
                className="form-control"
                name="description"
                rows="3"
                value={form.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          {/* ✅ BUTTONS */}
          <div className="mt-4 text-end d-flex gap-2 justify-content-end">
            <button
              type="submit"
              className="btn btn-primary px-4 fw-semibold"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="btn btn-danger px-4 fw-semibold"
              onClick={handleDelete}
            >
              Delete Event
            </button>
          </div>
        </div>
      </form>
      </div>
    </DashboardLayout>
  );
}
