const express = require('express');
const router = express.Router();

const {
  getDashboardStats,
  getAnalytics
} = require('../controllers/dashboardController');

// Dashboard page
router.get('/', getDashboardStats);

// Analytics page
router.get('/analytics', getAnalytics);

module.exports = router;
