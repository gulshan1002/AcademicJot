const client = require("../config/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getDataUri = require('../utils/dataUri');
const cloudinary = require('cloudinary');

const createJournal = async (req, res) => {
    try {
        const teacher = req.user.id;
        let { description, fileType, attachment, students } = req.body;
        console.log(req.file);
        // console.log(req.body);

        students = students.split(',').map(student => parseInt(student.trim()));

        // console.log(students);


        if (!description || !fileType || !students || students.length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide all the required fields.', 
            });
        }
        let file = req.file;
        if(file){
            const fileUri = getDataUri(file).content;
            const result = await cloudinary.uploader.upload(fileUri);
            attachment = result.secure_url;
        }
                // Insert the journal into the journal table
        const insertJournalQuery = `
            INSERT INTO journal (description, attachment, fileType, teacher)
            VALUES ($1, $2, $3, $4) RETURNING id;
        `;
        const insertJournalValues = [description, attachment, fileType, teacher];
        const journalResult = await client.query(insertJournalQuery, insertJournalValues);

        const journalId = journalResult.rows[0].id;

        // Insert rows into the journal table to link students with the journal
        const insertStudentJournalQuery = `
            INSERT INTO studentJournal (studentId, journalId)
            VALUES ($1, $2);
        `;

        for (const studentId of students) {
            const insertStudentJournalValues = [studentId, journalId];
            await client.query(insertStudentJournalQuery, insertStudentJournalValues);
        }

        res.status(201).json({
            status: 'success',
            data: {
                journalId,
                attachment
            },
        });
    } catch (error) {
        console.error('Error during journal creation:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred during journal creation.',
        });
    }
};

const updateJournalById = async (req, res) => {
    try {
        const teacher = req.user.id;
        const journalId = req.params.id;
        let { description, fileType, attachment, publishedAt } = req.body;

        if (!description && !fileType && !publishedAt) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide the fields that you want to update.',
            });
        }
        let file = req.file;
        if (file) {
            const fileUri = getDataUri(file);
            const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);
            attachment = myCloud.secure_url;
        }
        console.log(req.body);
        const updateJournalQuery = `
            UPDATE journal SET description = COALESCE($1, description), attachment = COALESCE($2, attachment), fileType = COALESCE($3, fileType), publishedAt = COALESCE($4, publishedAt)
            WHERE id = $5 AND teacher = $6 RETURNING *;
        `;
        const updateJournalValues = [description, attachment, fileType, publishedAt, journalId, teacher];
        const result = await client.query(updateJournalQuery, updateJournalValues);

        if (!result.rowCount) {
            return res.status(404).json({
                status: 'fail',
                message: 'Journal not found!',
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                journal: result.rows[0],
            },
        });
    } catch (error) {
        console.error('Error during journal update:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred during journal update.',
        });
    }
};

const deleteJournalByTeacherId = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const journalId = req.params.id;

        await client.query('BEGIN');
        await client.query('DELETE FROM studentJournal WHERE journalId = $1', [journalId]);
        const result = await client.query('DELETE FROM journal WHERE id = $1 AND teacher = $2 RETURNING *', [journalId, teacherId]);
        await client.query('COMMIT');
        if (!result.rowCount) {
            return res.status(404).json({
                status: 'fail',
                message: 'Journal not found!',
            });
        }
        res.status(204).json({
            status: 'success',
            data: null,
        });

    } catch (error) {
        console.error('Error during journal deletion:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred during journal deletion.',
        });
    }
};

const getAllournalsByTeacherId = async (req, res) => {
    try {
        const teacher = req.user.id;
        const result = await client.query(
            `SELECT * FROM journal WHERE teacher = ${teacher} ORDER BY publishedAt DESC`
        );
        res.status(200).json({
            status: 'success',
            data: {
                journals: result.rows,
            },
        });
    } catch (error) {
        console.error('Error while fetching journals:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching journals.',
        });
    }
};




module.exports = {createJournal, updateJournalById, deleteJournalByTeacherId, getAllournalsByTeacherId};