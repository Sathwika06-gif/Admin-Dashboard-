const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: String,
  body: String,
  status: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', contentSchema);