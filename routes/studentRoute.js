const express = require('express');
const studentRouter = express.Router();
const {isStudent, isTeacher} = require('../middileware/auth');
const {getAllJournals} = require('../controllers/studentController');

studentRouter.get('/all', isStudent, getAllJournals);

module.exports = studentRouter;