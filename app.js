const express = require('express');
const userRoutes = require('./routes/userRoute');
const teacherRoutes = require('./routes/teacherRoute');
const studentRoutes = require('./routes/studentRoute');
const client = require('./config/db');


const app = express();

app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);

app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Welcome to Toddle Backend Server. Please use the correct route.`
    });
});

module.exports = app;