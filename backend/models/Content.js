const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  title: String,
  body: String,
  status: { type: String, default: 'Draft' },
  tags: [String],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', ContentSchema);