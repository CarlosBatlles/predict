const express = require('express');
const router = express.Router();
const controller = require('../controllers/mainController');

router.get('/health', controller.healthCheck);
router.post('/run', controller.runWorkflow);

module.exports = router;