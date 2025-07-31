// backend/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require("../middleware/auth");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// ✅ Auth middleware (ONLY ONCE)
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.role = decoded.role; // ✅ include role in request for role-based checks
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ✅ Multer config for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/events');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ✅ PUBLIC ROUTES
router.get('/', eventController.getAllEvents);        // anyone can view events
router.get('/:id', eventController.getEventById);     // anyone can view single event

// ✅ PROTECTED ROUTES
router.post('/', auth, upload.single('image'), eventController.createEvent);  // only planners
router.get('/my/events', auth, eventController.getUserEvents);                // logged-in user's events
router.put('/:id', auth, upload.single('image'), eventController.editEvent);
router.delete('/:id', auth, eventController.deleteEvent);

// ✅ RSVP (attendees)
router.post('/:id/rsvp', auth, eventController.rsvpEvent);
router.get('/:id/rsvp/update', eventController.rsvpFromEmail);
router.get("/:id/attendees", auth, eventController.getAttendees);
router.get("/attendees/all", auth, eventController.getAllAttendees);


module.exports = router;
