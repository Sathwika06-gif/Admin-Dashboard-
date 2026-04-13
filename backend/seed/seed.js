const mongoose = require('mongoose');
const Analytics = require('../models/analytics');

mongoose.connect("YOUR_MONGO_URL");

const data = [
  { date: new Date('2026-03-15'), revenue: 1200, signups: 1, activeUsers: 1 },
  { date: new Date('2026-03-20'), revenue: 2600, signups: 2, activeUsers: 2 },
  { date: new Date('2026-04-01'), revenue: 2400, signups: 1, activeUsers: 2 }
];

async function seed() {
  await Analytics.deleteMany();
  await Analytics.insertMany(data);
  console.log("Seeded");
  process.exit();
}

seed();