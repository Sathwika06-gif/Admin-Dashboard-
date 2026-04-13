const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: Date,
  revenue: Number,
  signups: Number,
  activeUsers: Number
});

module.exports = mongoose.model('Analytics', analyticsSchema);