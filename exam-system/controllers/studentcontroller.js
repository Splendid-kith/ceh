const studentModel = require('../models/studentmodel');

function registerStudent(req, res) {
    const { name, department } = req.body;

    // 1. Check if the name already exists
    studentModel.findStudentByName(name, (err, results) => {
        if (err) {
            console.error("Database Check Error:", err);
            return res.status(500).json({ error: "System error: unable to verify student status." });
        }

        // 2. Block registration if found
        if (results && results.length > 0) {
            return res.status(403).json({ error: "Registration blocked: A student with this exact name has already attended the exam." });
        }

        // 3. Otherwise, create the student
        studentModel.createStudent(name, department, (err, result) => {
            if (err) {
                console.error("Registration Error:", err);
                return res.status(500).json({ error: err.message || "Registration failed due to server error." });
            }
            res.json({ message: 'Student registered', id: result.insertId });
        });
    });
}

function listStudents(req, res) {
    studentModel.getAllStudents((err, results) => {
        if (err) {
            console.error("List Students Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
}

module.exports = { registerStudent, listStudents };