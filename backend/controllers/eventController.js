const Event = require('../models/Event');
const fs = require('fs');
const path = require('path');

/**
 * ✅ Create Event
 */
exports.createEvent = async (req, res) => {
  try {
    const { name, date, time, location, description, invitees } = req.body;

    const event = new Event({
      name,
      date,
      time,
      location,
      description,
      invitees: invitees ? invitees.split(',') : [], // turn CSV into array
      owner: req.userId,
      rsvps: [],
      image: req.file ? req.file.filename : null // store filename if uploaded
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error('❌ Error creating event:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

/**
 * ✅ Get All Events for Logged-in User
 */
exports.getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({ owner: req.userId });
    res.json(events);
  } catch (err) {
    console.error('❌ Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

/**
 * ✅ NEW: Get Event by Event ID
 */
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, owner: req.userId }); // ✅ ensure only owner can see
    if (!event) {
      return res.status(404).json({ error: "Event not found or not yours" });
    }
    res.json(event);
  } catch (err) {
    console.error("❌ Error fetching event by ID:", err);
    res.status(500).json({ error: "Failed to fetch event" });
  }
};


/**
 * ✅ Edit Event
 */
exports.editEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, owner: req.userId });
    if (!event) {
      return res.status(404).json({ error: 'Event not found or not yours' });
    }

    // ✅ If a new image is uploaded, remove the old one
    if (req.file) {
      if (event.image) {
        const oldImagePath = path.join(__dirname, '../uploads/events', event.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.warn('⚠️ Old image could not be deleted:', err);
        });
      }
      event.image = req.file.filename;
    }

    // ✅ Update fields if new data is provided
    event.name = req.body.name || event.name;
    event.date = req.body.date || event.date;
    event.time = req.body.time || event.time;
    event.location = req.body.location || event.location;
    event.description = req.body.description || event.description;
    event.invitees = req.body.invitees ? req.body.invitees.split(',') : event.invitees;

    await event.save();
    res.json({ message: '✅ Event updated successfully', event });
  } catch (err) {
    console.error('❌ Error editing event:', err);
    res.status(500).json({ error: 'Failed to edit event' });
  }
};

/**
 * ✅ Delete Event
 */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!event) {
      return res.status(404).json({ error: 'Event not found or not yours' });
    }

    // ✅ Delete the event image if it exists
    if (event.image) {
      const imagePath = path.join(__dirname, '../uploads/events', event.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.warn('⚠️ Event image could not be deleted:', err);
      });
    }

    res.json({ message: '✅ Event deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting event:', err);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

/**
 * ✅ RSVP Event
 */
exports.rsvpEvent = async (req, res) => {
  try {
    const { email, status } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ error: 'Event not found' });

    // ✅ Check if RSVP already exists
    const existing = event.rsvps.find((r) => r.email === email);
    if (existing) {
      existing.status = status;
    } else {
      event.rsvps.push({ email, status });
    }

    await event.save();
    res.json({ message: '✅ RSVP updated', rsvps: event.rsvps });
  } catch (err) {
    console.error('❌ Error updating RSVP:', err);
    res.status(500).json({ error: 'Failed to update RSVP' });
  }
};
