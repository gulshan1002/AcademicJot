const db = require("../config/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getDataUri = require('../utils/dataUri');
const cloudinary = require('cloudinary');
const sendEmail = require('../utils/email');

const createJournal = async (req, res) => {
    try {
        const teacher = req.user.id;
        let { description, filetype, attachment, students } = req.body;
        // console.log(req.body);
        // console.log(req.file);

        students = students.split(',').map(student => parseInt(student.trim()));
        // console.log(students);
        if (!description || !filetype || !students || students.length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide all the required fields.', 
            });
        }
        let file = req.file;
        if (file) {
            const fileUri = getDataUri(file).content;
            const result = await cloudinary.uploader.upload(fileUri);
            attachment = result.secure_url;
        }
        console.log(attachment);
        const journalid = await db.transaction(async trx => {
            const [journalid] = await trx('journal').insert({
                description,
                attachment,
                filetype,
                teacher
            }).returning('id');

            for (const studentid of students) {
                console.log(studentid, journalid);
                await trx('studentjournal').insert({
                    studentid,
                    journalid: journalid.id
                });
            }
            return journalid;
        });
        // now i want to send all the students an email
        const studentEmails = await db('student')
            .select('email')
            .whereIn('id', students);
        const studentEmailsArray = studentEmails.map(student => student.email);
        console.log(studentEmailsArray);
        const message = `A new journal has been created for you. Please check it out`;
        // iterate over the studentEmailsArray and send an email to each of them
        for (const email of studentEmailsArray) {
            await sendEmail({
                email,
                subject: 'New Journal',
                message
            });
        }
        res.status(201).json({
            status: 'success',
            data: {
                journalid,
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
        const journalid = req.params.id;
        let { description, filetype, attachment, publishedAt } = req.body;

        if (!description && !filetype && !publishedAt) {
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

        const [updatedJournal] = await db('journal')
            .where('id', journalid)
            .andWhere('teacher', teacher)
            .update({
                description: description || db.raw('description'),
                attachment: attachment || db.raw('attachment'),
                filetype: filetype || db.raw('filetype'),
                publishedat: publishedAt || db.raw('publishedat')
            })
            .returning('*');

        if (!updatedJournal) {
            return res.status(404).json({
                status: 'fail',
                message: 'Journal not found!',
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                journal: updatedJournal,
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
        const journalid = req.params.id;

        let deletedJournal;

        await db.transaction(async trx => {
            await trx('studentjournal')
                .where('journalid', journalid)
                .del();
            [deletedJournal] = await trx('journal')
                .where('id', journalid)
                .andWhere('teacher', teacherId)
                .del()
                .returning('*');
        });

        if (!deletedJournal) {
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
        const result = await db('journal')
            .where('teacher', teacher)
            .orderBy('publishedat', 'DESC');

        res.status(200).json({
            status: 'success',
            data: {
                journals: result,
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