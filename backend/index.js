require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://mail2fahmy:0eFaerZ68FMAgkO2@cluster0.gkwxq63.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');

// ✅ Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Use routes
app.use('/api/auth', userRoutes);
app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
