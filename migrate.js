require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Connection failed:', err);
        process.exit(1);
    }
    console.log('Connected.');

    const sql = `ALTER TABLE results 
                 ADD COLUMN IF NOT EXISTS correct_count INT DEFAULT 0, 
                 ADD COLUMN IF NOT EXISTS wrong_count INT DEFAULT 0,
                 ADD COLUMN IF NOT EXISTS unanswered_count INT DEFAULT 0;`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Migration failed:', err);
        } else {
            console.log('Migration successful.');
        }
        db.end();
    });
});
