const db = require("../config/db"); // Update the path to your Knex database connection file
const jwt = require('jsonwebtoken');

const isStudent = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({
                status: 'Unauthorized Access',
                message: 'You are not logged in.',
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).send({
                status: 'fail',
                message: 'Invalid Token, Login again'
            });
        }

        const result = await db.select('*').from('student').where('id', decoded.id).first();

        if (!result) {
            return res.status(401).json({
                status: 'fail',
                message: 'The user belonging to this token does no longer exist.',
            });
        }
        
        req.user = result;
        next();
    } catch (err) {
        console.error('Error during authorization:', err);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred during authorization.',
        });
    }
};

const isTeacher = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({
                status: 'Unauthorized Access',
                message: 'You are not logged in.',
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).send({
                status: 'fail',
                message: 'Invalid Token, Login again'
            });
        }

        const result = await db.select('*').from('teacher').where('id', decoded.id).first();

        if (!result) {
            return res.status(401).json({
                status: 'fail',
                message: 'The user belonging to this token does no longer exist.',
            });
        }
        
        req.user = result;
        next();
    } catch (err) {
        console.error('Error during authorization:', err);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred during authorization.',
        });
    }
};

module.exports = { isStudent, isTeacher };
