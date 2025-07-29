const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// ✅ Auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

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

// ✅ Routes
router.post('/', auth, upload.single('image'), eventController.createEvent);
router.get('/', auth, eventController.getUserEvents);
router.put('/:id', auth, upload.single('image'), eventController.editEvent);
router.get('/:id', auth, eventController.getEventById);
router.delete('/:id', auth, eventController.deleteEvent);
router.post('/:id/rsvp', eventController.rsvpEvent);

module.exports = router;
