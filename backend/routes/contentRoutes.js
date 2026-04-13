const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contentController');

router.post('/', ctrl.createContent);
router.get('/', ctrl.getContent);

module.exports = router;