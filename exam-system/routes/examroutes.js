const express = require('express');
const router = express.Router();
const examController = require('../controllers/examcontroller');

router.get('/', examController.getExam);
router.post('/submit', examController.submitExam);

module.exports = router;