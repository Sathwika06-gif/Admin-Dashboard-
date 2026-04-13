const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/analyticsController');

router.get('/summary', ctrl.getSummary);
router.get('/charts', ctrl.getCharts);

module.exports = router;