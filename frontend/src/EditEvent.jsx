import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Tag, Image as ImageIcon } from "lucide-react";
import DashboardLayout from "./componets/DashboardLayout";
import toast from "react-hot-toast";

export default function EditEvent({ token, onLogout }) {
  const { id } = useParams();
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
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

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
          date: data.date ? data.date.split("T")[0] : "",
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
        toast.error("❌ Could not load event details");
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
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ VALIDATION FUNCTION
  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Event name is required.";
    if (!form.date) newErrors.date = "Event date is required.";
    if (!form.time) newErrors.time = "Event time is required.";
    if (!form.location.trim()) newErrors.location = "Event location is required.";

    // 🕒 Prevent past date selection
    const selectedDateTime = new Date(`${form.date}T${form.time}`);
    if (selectedDateTime < new Date()) {
      newErrors.date = "Event date/time cannot be in the past.";
    }

    // ✅ Price is optional but cannot be negative
    if (form.price && form.price < 0) {
      newErrors.price = "Ticket price cannot be negative.";
    }

    // ✅ Seats required
    if (!form.seats || form.seats <= 0) {
      newErrors.seats = "Seat amount must be greater than 0.";
    }

    return newErrors;
  };

  // ✅ UPDATE EVENT
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("⚠️ Please fix the errors before saving.");
      return;
    }

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

      toast.success(" Event updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(" Error updating event");
    } finally {
      setLoading(false);
    }
  };

// ✅ DELETE EVENT
const handleDelete = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to delete event");

    toast.success("🗑️ Event deleted successfully!");
    setShowConfirm(false); // ✅ Close the modal after delete
    navigate("/dashboard");
  } catch (err) {
    console.error(err);
    toast.error("❌ Error deleting event");
  }
};

  return (
    <DashboardLayout onLogout={onLogout}>
      <div className="card shadow-sm border-0 h-90"
        style={{ borderRadius: "16px", overflow: "hidden", padding: "16px" }}>
        <h3 className="fw-bold text-primary mb-4"> Edit Event</h3>
      </div>

      <div className="mb-4"></div>

      <div className="card shadow-sm border-0 h-90"
        style={{ borderRadius: "16px", overflow: "hidden", padding: "16px" }}>
        <form onSubmit={handleSubmit} className="row g-4">

          {/* ✅ IMAGE UPLOAD */}
          <div className="col-md-4 text-center">
            <div className="border rounded p-3" style={{ height: "250px" }}>
              {preview ? (
                <img src={preview} alt="Preview" className="img-fluid rounded"
                  style={{ maxHeight: "200px", objectFit: "cover" }} />
              ) : (
                <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted">
                  <ImageIcon size={40} />
                  <span>Upload Event Image</span>
                </div>
              )}
              <input type="file" className="form-control mt-2" accept="image/*" onChange={handleImageUpload} />
            </div>
          </div>

          {/* ✅ EVENT DETAILS */}
          <div className="col-md-8">
            <div className="row g-3">
              {/* Event Name */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Event Name</label>
                <input type="text" className={`form-control ${errors.name ? "is-invalid" : ""}`} name="name" value={form.name} onChange={handleChange} />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              {/* Event Date */}
              <div className="col-md-3">
                <label className="form-label fw-semibold">Event Date</label>
                <div className="input-group">
                  <span className="input-group-text"><Calendar size={16} /></span>
                  <input type="date" className={`form-control ${errors.date ? "is-invalid" : ""}`} name="date" value={form.date} onChange={handleChange} />
                  {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                </div>
              </div>

              {/* Event Time */}
              <div className="col-md-3">
                <label className="form-label fw-semibold">Event Time</label>
                <div className="input-group">
                  <span className="input-group-text"><Clock size={16} /></span>
                  <input type="time" className={`form-control ${errors.time ? "is-invalid" : ""}`} name="time" value={form.time} onChange={handleChange} />
                  {errors.time && <div className="invalid-feedback">{errors.time}</div>}
                </div>
              </div>

              {/* Venue */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">Event Venue</label>
                <div className="input-group">
                  <span className="input-group-text"><MapPin size={16} /></span>
                  <input type="text" className={`form-control ${errors.location ? "is-invalid" : ""}`} name="location" value={form.location} onChange={handleChange} />
                  {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                </div>
              </div>

              {/* Description */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">Event Description</label>
                <textarea className="form-control" name="description" rows="3" value={form.description} onChange={handleChange}></textarea>
              </div>

              {/* ✅ Price */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Ticket Price</label>
                <input type="number" className="form-control" name="price" value={form.price} onChange={handleChange} />
                {errors.price && <div className="text-danger">{errors.price}</div>}
              </div>

              {/* ✅ Seats */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Seat Amount</label>
                <input type="number" className="form-control" name="seats" value={form.seats} onChange={handleChange} />
                {errors.seats && <div className="text-danger">{errors.seats}</div>}
              </div>

              {/* ✅ Tags */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Tags</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Tag size={16} />
                  </span>
                  <input type="text" className="form-control" placeholder="#Music, #Festival" name="tags" value={form.tags} onChange={handleChange} />
                </div>
              </div>

            </div>

            {/* ✅ BUTTONS */}
            <div className="mt-4 text-end d-flex gap-2 justify-content-end">
              <button type="submit" className="btn btn-primary px-4 fw-semibold" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
  type="button"
  className="btn btn-danger px-4 fw-semibold"
  onClick={() => setShowConfirm(true)}
>
  Delete Event
</button>

{showConfirm && (
  <>
    {/* ✅ Bootstrap Modal */}
    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          
          {/* ✅ Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Are you sure?</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowConfirm(false)}
            ></button>
          </div>

          {/* ✅ Modal Body */}
          <div className="modal-body">
            <p>This action cannot be undone.</p>
          </div>

          {/* ✅ Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* ✅ Backdrop */}
    <div
      className="modal-backdrop fade show"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      onClick={() => setShowConfirm(false)}
    ></div>
  </>
)}


            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
