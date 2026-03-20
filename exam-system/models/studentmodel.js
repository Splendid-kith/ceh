const db = require('../config/db');

function createStudent(name, department, callback) {
    db.query(
        'INSERT INTO students (name, department) VALUES (?, ?)',
        [name, department],
        callback
    );
}

function getAllStudents(callback) {
    db.query('SELECT * FROM students', callback);
}

function findStudentByName(name, callback) {
    db.query('SELECT id FROM students WHERE name = ?', [name], callback);
}

function deleteStudentById(id, callback) {
    db.query('DELETE FROM students WHERE id = ?', [id], callback);
}

function deleteAllStudents(callback) {
    db.query('DELETE FROM students', callback);
}

module.exports = { createStudent, getAllStudents, findStudentByName, deleteStudentById, deleteAllStudents };