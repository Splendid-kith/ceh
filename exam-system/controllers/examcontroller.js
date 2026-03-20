const fs = require('fs');
const path = require('path');
const { shuffleArray } = require('../utils/shuffle');
const resultModel = require('../models/resultmodel');

function getExam(req, res) {
    const questionsPath = path.join(__dirname, '../public/data/ceh_questions.json');
    const data = JSON.parse(fs.readFileSync(questionsPath));

    // Handle flat array and shuffle
    let exam = shuffleArray([...data]).slice(0, 50);

    // Strip answers before sending to client for security
    const secureExam = exam.map(q => {
        const { answer, ...rest } = q;
        return rest;
    });

    res.json(secureExam);
}

function submitExam(req, res) {
    const { student_id, answers } = req.body; // answers is an array of { id, selected }
    const questionsPath = path.join(__dirname, '../public/data/ceh_questions.json');
    const allQuestions = JSON.parse(fs.readFileSync(questionsPath));

    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;

    answers.forEach(submitted => {
        const original = allQuestions.find(q => q.id === submitted.id);
        if (original) {
            if (submitted.selected === original.answer) {
                score += 1;
                correctCount++;
            } else if (submitted.selected) {
                score -= 0.25;
                wrongCount++;
            }
        }
    });

    const unansweredCount = answers.length - correctCount - wrongCount;

    resultModel.saveResult(student_id, answers, score, correctCount, wrongCount, unansweredCount, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Result saved', score, correct: correctCount, wrong: wrongCount, unanswered: unansweredCount });
    });
}

module.exports = { getExam, submitExam };