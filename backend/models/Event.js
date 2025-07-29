const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: String,
  date: String,
  time: String,
  location: String,
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  invitees: [String],
  rsvps: [{ email: String, status: String }],
});

module.exports = mongoose.model('Event', eventSchema); 