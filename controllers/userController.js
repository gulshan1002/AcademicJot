const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require("../config/db"); // Update the path to your Knex database connection file

const signToken = function(id, role){
    return jwt.sign({id, role}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const signup = async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide all the required fields.',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let result;
        
        if (role === 'student' || role === 'teacher') {
            result = await db.insert({ name, email, password: hashedPassword }).into(role);
        } else {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid role.',
            });
        }

        const token = signToken(result[0], role);
        
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: { id: result[0], name, email },
            },
        });
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred during signup.',
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide email, password, and role.',
            });
        }

        let table;
        if (role === 'student') {
            table = 'student';
        } else if (role === 'teacher') {
            table = 'teacher';
        } else {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid role.',
            });
        }

        const user = await db.select('*').from(table).where('email', email).first();

        if (!user) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid email or password.',
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid email or password.',
            });
        }

        const token = signToken(user.id, role);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user,
            },
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred during login.',
        });
    }
};

module.exports = { signup, login };
