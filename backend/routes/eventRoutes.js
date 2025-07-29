const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Auth middleware
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.post('/', auth, eventController.createEvent);
router.get('/', auth, eventController.getUserEvents);
router.put('/:id', auth, eventController.editEvent);
router.delete('/:id', auth, eventController.deleteEvent);
router.post('/:id/rsvp', eventController.rsvpEvent);

module.exports = router; 