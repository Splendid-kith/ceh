require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const studentRoutes = require('./routes/studentroutes');
const examRoutes = require('./routes/examroutes');
const adminRoutes = require('./routes/adminroutes');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/admin', adminRoutes);

// Serve frontend pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/student-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'student-login.html'));
});

app.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;