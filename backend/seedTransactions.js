require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const Content = require('./models/Content');
const Transaction = require('./models/Transaction');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Remove old data
    await User.deleteMany({});
    await Content.deleteMany({});
    await Transaction.deleteMany({});

    // Insert users
    const users = await User.insertMany([
      {
        name: 'Sarah Johnson',
        email: 'admin@smartwinnr.com',
        password: 'admin123',
        role: 'Admin',
        status: 'Active',
        createdAt: new Date('2025-10-12')
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        password: 'password123',
        role: 'Moderator',
        status: 'Active',
        createdAt: new Date('2025-12-11')
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        password: 'password123',
        role: 'User',
        status: 'Active',
        createdAt: new Date('2026-01-10')
      },
      {
        name: 'James Wilson',
        email: 'james.wilson@example.com',
        password: 'password123',
        role: 'User',
        status: 'Active',
        createdAt: new Date('2026-02-09')
      },
      {
        name: 'Emma Davis',
        email: 'emma.davis@example.com',
        password: 'password123',
        role: 'User',
        status: 'Inactive',
        createdAt: new Date('2026-02-24')
      },
      {
        name: 'Carlos Rodriguez',
        email: 'carlos.r@example.com',
        password: 'password123',
        role: 'Moderator',
        status: 'Active',
        createdAt: new Date('2026-03-11')
      },
      {
        name: 'Lisa Park',
        email: 'lisa.park@example.com',
        password: 'password123',
        role: 'User',
        status: 'Active',
        createdAt: new Date('2026-03-25')
      }
    ]);

    console.log(`Inserted ${users.length} users`);

    // Insert sample content
    await Content.insertMany([
      {
        title: 'Welcome Announcement',
        author: 'Sarah Johnson',
        status: 'Published',
        views: 1240,
        createdAt: new Date('2026-03-01')
      },
      {
        title: 'Monthly Report',
        author: 'Michael Chen',
        status: 'Draft',
        views: 860,
        createdAt: new Date('2026-03-15')
      },
      {
        title: 'Platform Update',
        author: 'Carlos Rodriguez',
        status: 'Published',
        views: 2140,
        createdAt: new Date('2026-04-01')
      }
    ]);

    console.log('Inserted sample content');

    // Insert 31 days of revenue transactions
    const transactions = [];

    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const amount = Math.floor(Math.random() * 2200) + 800; // ₹800–₹3000
      const user = users[Math.floor(Math.random() * users.length)];

      transactions.push({
        userId: user._id,
        amount,
        currency: 'INR',
        status: 'paid',
        paymentDate: date,
        razorpayOrderId: `order_${Date.now()}_${i}`,
        razorpayPaymentId: `pay_${Date.now()}_${i}`,
        razorpaySignature: 'sample_signature'
      });
    }

    await Transaction.insertMany(transactions);

    const totalRevenue = transactions.reduce(
      (sum, tx) => sum + tx.amount,
      0
    );

    console.log(`Inserted ${transactions.length} transactions`);
    console.log(`Total Revenue: ₹${totalRevenue}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
}

seedDatabase();