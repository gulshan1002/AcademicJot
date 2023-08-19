const client = require("../config/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signToken = function(id){
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
};

const signup = async (req, res) => {
    try{
        console.log(req.body);
        const {name, email, password, role} = req.body;
        if(!name || !email || !password || !role){
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide all the required fields.',
            });
        }
        let result;
        const hashedPassword = await bcrypt.hash(password, 10);
        if(role == 'student'){
            result = await client.query(
                'INSERT INTO student (name, email, password) VALUES ($1, $2, $3) RETURNING *',
                [name, email, hashedPassword]
            );
        }
        else if(role == 'teacher'){
            result = await client.query(
                'INSERT INTO teacher (name, email, password) VALUES ($1, $2, $3) RETURNING *',
                [name, email, hashedPassword]
            );
        }
        if(!result){
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide all the required fields.',
            });
        }
        const token = signToken(result.rows[0].id);
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: result.rows[0],
            },
        });
    }
    catch(err){
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
        let user;
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
        const result = await client.query(
            `SELECT * FROM ${table} WHERE email = $1`,
            [email]
        );

        if (!result.rows[0]) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid email or password.',
            });
        }

        user = result.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid email or password.',
            });
        }

        const token = signToken(user.id);

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

module.exports = {signup, login};