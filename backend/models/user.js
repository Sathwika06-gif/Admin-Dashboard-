const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // CSV column: account
    account: {
      type: String
    },

    // Optional name field
    name: {
      type: String
    },

    email: {
      type: String
    },

    role: {
      type: String,
      default: 'User'
    },

    status: {
      type: String,
      default: 'Active'
    },

    // IMPORTANT:
    // Store joined exactly as string from CSV.
    // Example: "2026-04-13"
    joined: {
      type: String
    },

    // Optional password for manually added users
    password: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
