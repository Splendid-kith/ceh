const resultModel = require('../models/resultmodel');

function viewResults(req, res) {
    resultModel.getAllResults((err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
}

function login(req, res) {
    const { username, password } = req.body;
    
    // Credentials provided by user: username- A&min, password- 097531
    if (username === 'A&min' && password === '097531') {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
}

function deleteAttempt(req, res) {
    const studentId = req.params.id;
    if (!studentId) return res.status(400).json({ error: "No student ID provided" });

    // 1. Delete the exam results
    resultModel.deleteResultByStudentId(studentId, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // 2. Delete the student entirely so they can register again
        const studentModel = require('../models/studentmodel');
        studentModel.deleteStudentById(studentId, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Attempt deleted successfully. The student can now retake the exam." });
        });
    });
}

function clearAllAttempts(req, res) {
    // 1. Delete all results
    resultModel.deleteAllResults((err) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // 2. Delete all students
        const studentModel = require('../models/studentmodel');
        studentModel.deleteAllStudents((err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "All data cleared successfully." });
        });
    });
}

module.exports = { viewResults, login, deleteAttempt, clearAllAttempts };