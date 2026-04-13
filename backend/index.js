require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes (keep before listen)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ MongoDB Atlas Connected");
  seedAdmin();
})
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err.message);
});

// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

// model
const User = require('./models/User');

// create default admin
async function seedAdmin() {
  try {
    const exists = await User.findOne({ email: "admin@gmail.com" });

    if (!exists) {
      const hashed = await bcrypt.hash("123456", 10);

      await User.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashed,
        role: "admin"
      });

      console.log("✅ Admin created");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (error) {
    console.error("❌ Error in seeding admin:", error.message);
  }
}