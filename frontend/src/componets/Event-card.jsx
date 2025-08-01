import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, Eye, Ticket, Users, Wallet } from "lucide-react";

const EventCard = ({ 
    id,
  name, 
  date, 
  time, 
  location, 
  description, 
  invitees, 
  rsvps, 
  price, 
  image 
}) => {
    const navigate = useNavigate();
  return (
    <div
      className="card shadow-sm border-0 h-100"
      style={{ borderRadius: "16px", overflow: "hidden" }}
    >
      {/* 🎟 Event Image */}
      <div style={{ height: "180px", overflow: "hidden" }}>
        <img 
          src={image} 
          alt={name} 
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
      </div>

      {/* 📄 Event Info */}
      <div className="card-body" style={{ backgroundColor: "#f8f9fa" }}>
        {/* 🏷 Title */}
        <h5 className="fw-bold mb-3">{name}</h5>

        {/* 💰 Price / 🎟 Tickets / 👥 RSVPs Row */}
        <div className="d-flex justify-content-between mb-3">
          <span className="d-flex align-items-center fw-bold text-success">
            <Wallet size={18} className="me-2 text-dark" /> {price || "Free"}
          </span>
          <span className="d-flex align-items-center text-danger fw-semibold">
            <Ticket size={18} className="me-1" /> {invitees?.length || 0}
          </span>
          <span className="d-flex align-items-center text-primary fw-semibold">
            <Users size={18} className="me-1" /> {rsvps?.length || 0}
          </span>
        </div>

        {/* 📍 Venue */}
        <p className="mb-1 d-flex align-items-center">
          <MapPin size={16} className="me-2 text-danger" />
          <strong>Venue:</strong>&nbsp;{location}
        </p>

        {/* 📅 Date */}
        <p className="mb-1 d-flex align-items-center">
          <Calendar size={16} className="me-2 text-primary" />
          <strong>Date:</strong>&nbsp;{new Date(date).toLocaleDateString("en-GB")}
        </p>

        {/* ⏰ Time */}
        <p className="mb-3 d-flex align-items-center">
          <Clock size={16} className="me-2 text-secondary" />
          <strong>Time:</strong>&nbsp;{time}
        </p>

        {/* 👁 View Button */}
        <button 
          className="btn btn-outline-secondary w-100 fw-semibold d-flex align-items-center justify-content-center"
          style={{ borderRadius: "12px" }}
          onClick={() => navigate(`/edit-events/${id}`)}
        >
          <Eye size={18} className="me-2" /> View
        </button>
      </div>
    </div>
  );
};

export default EventCard;
