const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  const { name, date, time, location, description, invitees } = req.body;
  const event = new Event({
    name, date, time, location, description, invitees, owner: req.userId, rsvps: []
  });
  await event.save();
  res.status(201).json(event);
};

exports.getUserEvents = async (req, res) => {
  const events = await Event.find({ owner: req.userId });
  res.json(events);
};

exports.editEvent = async (req, res) => {
  const event = await Event.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId },
    req.body,
    { new: true }
  );
  if (!event) return res.status(404).json({ error: 'Event not found or not yours' });
  res.json(event);
};

exports.deleteEvent = async (req, res) => {
  const event = await Event.findOneAndDelete({ _id: req.params.id, owner: req.userId });
  if (!event) return res.status(404).json({ error: 'Event not found or not yours' });
  res.json({ message: 'Event deleted' });
};

exports.rsvpEvent = async (req, res) => {
  const { email, status } = req.body; // status: Yes, No, Maybe
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  const existing = event.rsvps.find(r => r.email === email);
  if (existing) existing.status = status;
  else event.rsvps.push({ email, status });
  await event.save();
  res.json({ message: 'RSVP updated' });
}; 