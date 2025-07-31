const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  time: String,
  location: String,
  description: String,
  invitees: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  image: String,
  rsvps: [
    {
      email: String,
      status: { type: String, enum: ["Yes", "No"], default: "No" }
    }
  ]
});

module.exports = mongoose.model("Event", EventSchema);
