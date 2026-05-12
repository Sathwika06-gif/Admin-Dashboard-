const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  account: String,
  sector: String,
  year_established: Number,
  revenue: Number,
  employees: Number,
  office_location: String,
  subsidiary_of: String
});

module.exports = mongoose.model('Account', accountSchema);