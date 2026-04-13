const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(
      "YOUR_MONGODB_ATLAS_URL",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;