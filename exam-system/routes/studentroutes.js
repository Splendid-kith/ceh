const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentcontroller');

router.post('/register', studentController.registerStudent);
router.get('/', studentController.listStudents);

module.exports = router;