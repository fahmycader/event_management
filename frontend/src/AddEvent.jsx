import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import DashboardLayout from "./componets/DashboardLayout";
import toast from "react-hot-toast";

export default function AddEvent({ token, onLogout }) {
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
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: "" });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = "Event name is required.";
    if (!form.date) newErrors.date = "Please select a date.";
    if (!form.time) newErrors.time = "Please select a time.";

    // ✅ Date & Time Validation
    if (form.date && form.time) {
      const selectedDateTime = new Date(`${form.date}T${form.time}`);
      const now = new Date();
      if (selectedDateTime < now) {
        newErrors.date = "Event date & time cannot be in the past.";
        newErrors.time = "Event date & time cannot be in the past.";
      }
    }

    if (!form.location.trim()) newErrors.location = "Event location is required.";
    if (!form.description.trim())
      newErrors.description = "Please provide a description.";
    if (!form.price || form.price <= 0)
      newErrors.price = "Ticket price must be greater than 0.";
    if (!form.seats || form.seats <= 0)
      newErrors.seats = "Seat amount must be greater than 0.";
    if (!form.tags.trim()) newErrors.tags = "Please enter at least one tag.";
    if (!imageFile) newErrors.image = "Please upload an event image.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("date", form.date);
      formData.append("time", form.time);
      formData.append("location", form.location);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("seats", form.seats);
      formData.append("tags", form.tags);
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create event");

     
      toast.success("✅ Event created successfully!");
      setForm({
        name: "",
        date: "",
        time: "",
        location: "",
        description: "",
        price: "",
        seats: "",
        tags: "",
      });
      setImageFile(null);
      setPreview(null);
      setErrors({});
    } catch (err) {
      console.error(err);
      alert("❌ Error creating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout onLogout={onLogout}>
      <div
        className="card shadow-sm border-0 h-90"
        style={{ borderRadius: "16px", overflow: "hidden", padding: "16px" }}
      >
        <h3 className="fw-bold text-primary mb-4">➕ Add New Event</h3>
      </div>
      <div className="mb-4"></div>
      <div
        className="card shadow-sm border-0 h-90"
        style={{ borderRadius: "16px", overflow: "hidden", padding: "16px" }}
      >
        <form onSubmit={handleSubmit} className="row g-4">
          {/* ✅ Image Upload */}
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
              {errors.image && <small className="text-danger">{errors.image}</small>}
            </div>
          </div>

          {/* ✅ Right Section Inputs */}
          <div className="col-md-8">
            <div className="row g-3">
              {/* Event Name */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Event Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && <small className="text-danger">{errors.name}</small>}
              </div>

              {/* Event Date */}
              <div className="col-md-3">
                <label className="form-label fw-semibold">Event Date</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Calendar size={16} />
                  </span>
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                  />
                </div>
                {errors.date && <small className="text-danger">{errors.date}</small>}
              </div>

              {/* Event Time */}
              <div className="col-md-3">
                <label className="form-label fw-semibold">Event Time</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Clock size={16} />
                  </span>
                  <input
                    type="time"
                    className="form-control"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                  />
                </div>
                {errors.time && <small className="text-danger">{errors.time}</small>}
              </div>

              {/* Venue */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">Event Venue</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <MapPin size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                  />
                </div>
                {errors.location && <small className="text-danger">{errors.location}</small>}
              </div>

              {/* Description */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">Event Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                ></textarea>
                {errors.description && (
                  <small className="text-danger">{errors.description}</small>
                )}
              </div>

              {/* Price, Seats, Tags */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Ticket Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                />
                {errors.price && <small className="text-danger">{errors.price}</small>}
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Seat Amount</label>
                <input
                  type="number"
                  className="form-control"
                  name="seats"
                  value={form.seats}
                  onChange={handleChange}
                />
                {errors.seats && <small className="text-danger">{errors.seats}</small>}
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Tags</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Tag size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="#Music, #Festival"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                  />
                </div>
                {errors.tags && <small className="text-danger">{errors.tags}</small>}
              </div>
            </div>

            {/* ✅ Submit Button */}
            <div className="mt-4 text-end">
              <button
                type="submit"
                className="btn btn-primary px-4 fw-semibold"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Event"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
