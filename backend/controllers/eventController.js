const Event = require('../models/Event');
const fs = require('fs');
const path = require('path');
const User = require("../models/User");
const nodemailer = require("nodemailer");

// ✅ Setup transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "saka12345apple@gmail.com", // ✅ Your Gmail
    pass: "gdsy sjgg nrju auua",       // ✅ App password
  },
});

exports.rsvpEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.userId;

    // ✅ Find event
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // ✅ Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Compose RSVP email
    const mailOptions = {
      from: `"EventMate" <saka12345apple@gmail.com>`,
      to: user.email,
      subject: `🎉 RSVP for ${event.name}`,
      html: `
        <h2>You're Invited! 🎉</h2>
        <p>Hi <strong>${user.email}</strong>,</p>
        <p>Will you be attending <strong>${event.name}</strong>?</p>

        <div style="margin-top:20px">
          <a href="http://localhost:5000/api/events/${event._id}/rsvp/update?email=${user.email}&status=Yes" 
             style="background:#4CAF50;color:#fff;padding:10px 15px;text-decoration:none;border-radius:5px;margin-right:10px;">
            ✅ Yes, I’m Attending
          </a>

          <a href="http://localhost:5000/api/events/${event._id}/rsvp/update?email=${user.email}&status=No" 
             style="background:#F44336;color:#fff;padding:10px 15px;text-decoration:none;border-radius:5px;">
            ❌ No, I’m Not Attending
          </a>
        </div>

        <p style="margin-top:20px;">We look forward to your response! 🎉</p>
      `,
    };

    // ✅ Send RSVP email
    await transporter.sendMail(mailOptions);
    console.log(` RSVP email sent to ${user.email}`);

    res.json({ message: " RSVP email sent successfully" });
  } catch (err) {
    console.error(" RSVP Error:", err);
    res.status(500).json({ error: "Failed to send RSVP email" });
  }
};
exports.rsvpFromEmail = async (req, res) => {
  try {
    const { status, email } = req.query; // Yes or No from email link
    const eventId = req.params.id;

    // ✅ Find event
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).send("Event not found");

    // ✅ Update RSVP
    const existing = event.rsvps.find(r => r.email === email);
    if (existing) {
      existing.status = status;
    } else {
      event.rsvps.push({ email, status });
    }

    await event.save();

    // ✅ Send a friendly confirmation page
    res.send(`
      <html>
        <body style="font-family: Arial; text-align:center; margin-top:50px;">
          <h2>Thank you for your response!</h2>
          <p>Your RSVP for <b>${event.name}</b> has been marked as <b>${status}</b>.</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(" RSVP Email Update Error:", err);
    res.status(500).send(" Something went wrong.");
  }
};

exports.getAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // ✅ Separate attendees
    const attendees = event.rsvps
      .filter(r => (r.status === "Yes" || r.status === "Going") && r.email);

    const notAttendees = event.rsvps
      .filter(r => r.status === "No" && r.email);

    res.json({ attendees, notAttendees });
  } catch (err) {
    console.error("❌ Error fetching attendees:", err);
    res.status(500).json({ error: "Failed to fetch attendees" });
  }
};

exports.getAllAttendees = async (req, res) => {
  try {
    // Fetch all events
    const events = await Event.find();

    let attendees = [];
    let notAttendees = [];

    // Loop through each event and collect RSVPs
    events.forEach(event => {
      if (event.rsvps && event.rsvps.length > 0) {
        event.rsvps.forEach(rsvp => {
          // ✅ Attach event name for better context
          if ((rsvp.status === "Yes" || rsvp.status === "Going") && rsvp.email) {
            attendees.push({ 
              event: event.name,
              email: rsvp.email,
              status: rsvp.status
            });
          }
          if (rsvp.status === "No" && rsvp.email) {
            notAttendees.push({ 
              event: event.name,
              email: rsvp.email,
              status: rsvp.status
            });
          }
        });
      }
    });

    res.json({ attendees, notAttendees });
  } catch (err) {
    console.error("❌ Error fetching all attendees:", err);
    res.status(500).json({ error: "Failed to fetch all attendees" });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { name, date, time, location, description, invitees, price, seats } = req.body;

    const event = new Event({
      name,
      date,
      time,
      location,
      description,
      invitees: invitees ? invitees.split(',') : [], // turn CSV into array
      owner: req.userId,
      rsvps: [],
      image: req.file ? req.file.filename : null, // store filename if uploaded
      price: price ? Number(price) : null,        // ✅ optional price
      seats: seats ? Number(seats) : null         // ✅ optional seats
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
      return res.status(404).json({ error: "Event not found or not owned by you" });
    }

    // ✅ If a new image is uploaded, remove the old one
    if (req.file) {
      if (event.image) {
        const oldImagePath = path.join(__dirname, "../uploads/events", event.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.warn("⚠️ Old image could not be deleted:", err);
        });
      }
      event.image = req.file.filename;
    }

    // ✅ Update only if new data is provided
    event.name = req.body.name || event.name;
    event.date = req.body.date || event.date;
    event.time = req.body.time || event.time;
    event.location = req.body.location || event.location;
    event.description = req.body.description || event.description;
    event.invitees = req.body.invitees
      ? req.body.invitees.split(",")
      : event.invitees;

    // ✅ NEW FIELDS ADDED
    if (req.body.price !== undefined) {
      event.price = req.body.price === "" ? null : Number(req.body.price);
    }

    if (req.body.seats !== undefined) {
      event.seats = req.body.seats === "" ? null : Number(req.body.seats);
    }

    if (req.body.tags !== undefined) {
      event.tags = req.body.tags || event.tags;
    }

    await event.save();

    res.json({ message: "Event updated successfully", event });
  } catch (err) {
    console.error("Error editing event:", err);
    res.status(500).json({ error: "Failed to edit event" });
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



exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find(); // 🔓 no user filter
    res.json(events);
  } catch (err) {
    console.error('❌ Error fetching all events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

/**
 * ✅ Get Event by ID (PUBLIC)
 */
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id); // 🔓 allow public viewing
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    console.error("❌ Error fetching event by ID:", err);
    res.status(500).json({ error: "Failed to fetch event" });
  }
};