const db = require('../config/db');

function saveResult(student_id, answers, score, correct_count, wrong_count, unanswered_count, callback) {
    db.query(
        'INSERT INTO results (student_id, answers, score, correct_count, wrong_count, unanswered_count) VALUES (?, ?, ?, ?, ?, ?)',
        [student_id, JSON.stringify(answers), score, correct_count, wrong_count, unanswered_count],
        callback
    );
}

function getAllResults(callback) {
    db.query('SELECT r.id as result_id, s.id as student_id, s.name, r.answers, r.score, r.correct_count, r.wrong_count, r.unanswered_count FROM results r JOIN students s ON r.student_id = s.id', callback);
}

function deleteResultByStudentId(student_id, callback) {
    db.query('DELETE FROM results WHERE student_id = ?', [student_id], callback);
}

function deleteAllResults(callback) {
    db.query('DELETE FROM results', callback);
}

module.exports = { saveResult, getAllResults, deleteResultByStudentId, deleteAllResults };