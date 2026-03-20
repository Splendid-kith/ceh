const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admincontroller');

router.get('/results', adminController.viewResults);
router.post('/login', adminController.login);
router.delete('/delete/:id', adminController.deleteAttempt);
router.delete('/clear-all', adminController.clearAllAttempts);

module.exports = router;