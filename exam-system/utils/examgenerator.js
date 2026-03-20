const fs = require("fs");
const path = require("path");
const { shuffleArray } = require("./shuffle");

/*
Generate a random exam for each student
Loads CEH question bank and returns 50 shuffled questions
*/

function generateExam() {

    const questionPath = path.join(
        __dirname,
        "../public/data/ceh_questions.json"
    );

    if (!fs.existsSync(questionPath)) {
        throw new Error("CEH question file not found");
    }

    const data = JSON.parse(fs.readFileSync(questionPath, "utf-8"));

    let examQuestions = [];

    /*
    data structure example:

    {
      "Footprinting": [ ... ],
      "Scanning": [ ... ],
      "Web Attacks": [ ... ]
    }
    */

    Object.keys(data).forEach(topic => {

        const topicQuestions = shuffleArray([...data[topic]]);

        // take 5 questions per topic
        const selected = topicQuestions.slice(0, 5);

        selected.forEach(q => {

            examQuestions.push({
                id: q.id,
                question: q.question,
                options: shuffleArray([...q.options]),
                answer: q.answer
            });

        });

    });

    // Shuffle all selected questions
    examQuestions = shuffleArray(examQuestions);

    // Final exam size = 50
    examQuestions = examQuestions.slice(0, 50);

    return examQuestions;
}

module.exports = { generateExam };