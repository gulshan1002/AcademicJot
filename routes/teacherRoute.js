const express = require('express');
const teacherRouter = express.Router();
const {isStudent, isTeacher} = require('../middileware/auth');
const {createJournal, updateJournalById, deleteJournalByTeacherId, getAllournalsByTeacherId} = require('../controllers/teacherController');
const singleUpload = require('../middileware/multer');

teacherRouter.post('/create', isTeacher, singleUpload, createJournal);
teacherRouter.patch('/update/:id', isTeacher, singleUpload, updateJournalById);
teacherRouter.delete('/delete/:id', isTeacher, deleteJournalByTeacherId);
teacherRouter.get('/all', isTeacher, getAllournalsByTeacherId);
module.exports = teacherRouter;