const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

exports.register = async (req, res) => {
  const { email, password, role } = req.body;  // ✅ accept role
  try {
    const hashed = await bcrypt.hash(password, 10);

    //  force role to be either "attendee" or "planner"
    const user = new User({ 
      email, 
      password: hashed, 
      role: role === "planner" ? "planner" : "attendee" 
    });

    await user.save();
    res.status(201).json({ message: "✅ User registered", role: user.role });
  } catch (err) {
    res.status(400).json({ error: "❌ Email already exists" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  // ✅ include role in token payload
  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

  // ✅ also send role to frontend
  res.json({ token, role: user.role });
};

exports.validateUser = async (req, res) => {
  res.json({
    success: true,
    message: "✅ Token is valid",
    userId: req.userId,
    role: req.role,
  });
};


// Temporary in-memory OTP store (can be stored in Redis for production)
let otpStore = {};

// ✅ Setup nodemailer (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "saka12345apple@gmail.com",
    pass: "gdsy sjgg nrju auua", // ✅ Use App Password
  },
});

// ✅ Forgot Password - Send OTP
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "No account found with this email" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    // Send OTP Email
    await transporter.sendMail({
      from: `"EventMate" <saka12345apple@gmail.com>`,
      to: email,
      subject: "🔐 Your OTP Code",
      html: `<h2>Here’s your OTP: ${otp}</h2><p>Valid for 10 minutes.</p>`,
    });

    res.json({ message: "✅ OTP sent to email" });
  } catch (err) {
    console.error("❌ Forgot Password Error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// ✅ Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (otpStore[email] && otpStore[email] === otp) {
      return res.json({ message: "✅ OTP verified" });
    } else {
      return res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (err) {
    console.error("❌ OTP Verification Error:", err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};

// ✅ Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!otpStore[email] || otpStore[email] !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    delete otpStore[email]; // ✅ Clear OTP after use

    res.json({ message: "✅ Password updated successfully" });
  } catch (err) {
    console.error("❌ Reset Password Error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
};