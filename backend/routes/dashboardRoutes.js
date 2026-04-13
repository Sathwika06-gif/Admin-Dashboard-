const router = require('express').Router();
const { getStats } = require('../controllers/dashboardController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, getStats);

module.exports = router;