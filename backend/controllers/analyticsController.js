const Analytics = require('../models/analytics');

exports.getSummary = async (req, res) => {
  const data = await Analytics.find();

  res.json({
    totalUsers: 10,
    activeUsers: data.reduce((a, b) => a + b.activeUsers, 0),
    revenue: data.reduce((a, b) => a + b.revenue, 0),
    contentItems: 8
  });
};

exports.getCharts = async (req, res) => {
  const data = await Analytics.find().sort({ date: 1 });

  res.json({
    labels: data.map(d => d.date),
    revenue: data.map(d => d.revenue),
    signups: data.map(d => d.signups)
  });
};