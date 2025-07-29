import { useState } from "react";
import { Calendar, Clock, MapPin, Tag, Upload, Image as ImageIcon, Users } from "lucide-react";
import DashboardLayout from "./componets/DashboardLayout";

export default function AddEvent({ token, onLogout  }) {
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

  const [preview, setPreview] = useState(null); // ✅ Image preview
  const [imageFile, setImageFile] = useState(null); // ✅ Image file state
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); // ✅ For preview
    }
  };
  console.log("📤 Sending token:", token);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Prepare form data for sending
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("date", form.date);
      formData.append("time", form.time);
      formData.append("location", form.location);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("seats", form.seats);
      formData.append("tags", form.tags);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // ✅ Send to backend
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create event");

      alert("✅ Event created successfully!");
      setForm({ name: "", date: "", time: "", location: "", description: "", price: "", seats: "", tags: "" });
      setImageFile(null);
      setPreview(null);

    } catch (err) {
      console.error(err);
      alert("❌ Error creating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout onLogout={onLogout}> 
    <div className="card shadow-sm border-0 h-90"
      style={{ borderRadius: "16px", overflow: "hidden", padding: "16px" }}>
      <h3 className="fw-bold text-primary mb-4">➕ Add New Event</h3>
</div>
<div className="mb-4"></div>
<div className="card shadow-sm border-0 h-90"
      style={{ borderRadius: "16px", overflow: "hidden", padding: "16px" }}>
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
            <input type="file" className="form-control mt-2" accept="image/*" onChange={handleImageUpload} />
          </div>
        </div>

        {/* ✅ Right Section Inputs */}
        <div className="col-md-8">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Event Name</label>
              <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Event Date</label>
              <div className="input-group">
                <span className="input-group-text"><Calendar size={16} /></span>
                <input type="date" className="form-control" name="date" value={form.date} onChange={handleChange} required />
              </div>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Event Time</label>
              <div className="input-group">
                <span className="input-group-text"><Clock size={16} /></span>
                <input type="time" className="form-control" name="time" value={form.time} onChange={handleChange} required />
              </div>
            </div>

            <div className="col-md-12">
              <label className="form-label fw-semibold">Event Venue</label>
              <div className="input-group">
                <span className="input-group-text"><MapPin size={16} /></span>
                <input type="text" className="form-control" name="location" value={form.location} onChange={handleChange} required />
              </div>
            </div>

            <div className="col-md-12">
              <label className="form-label fw-semibold">Event Description</label>
              <textarea className="form-control" name="description" rows="3" value={form.description} onChange={handleChange}></textarea>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Ticket Price (LKR)</label>
              <input type="number" className="form-control" name="price" value={form.price} onChange={handleChange} />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Seat Amount</label>
              <input type="number" className="form-control" name="seats" value={form.seats} onChange={handleChange} />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Tags</label>
              <div className="input-group">
                <span className="input-group-text"><Tag size={16} /></span>
                <input type="text" className="form-control" placeholder="#Music, #Festival" name="tags" value={form.tags} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* ✅ Submit Button */}
          <div className="mt-4 text-end">
            <button type="submit" className="btn btn-primary px-4 fw-semibold" disabled={loading}>
              {loading ? "Saving..." : "Save Event"}
            </button>
          </div>
        </div>
      </form>
      </div>
      </DashboardLayout>
  );
}
