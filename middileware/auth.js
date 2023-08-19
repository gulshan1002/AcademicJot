const client = require("../config/db");
const jwt = require('jsonwebtoken');
const isStudent = async(req, res, next) => {
    // console.log(req.headers);
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log(token);
    if(!token){
        return res.status(401).json({
            status: 'Unauthorized Access',
            message: 'You are not logged in.',
        });
    }
    // 2. Verification token
    let decoded;
    try{
        // console.log(process.env.JWT_SECRET, token);
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch(err){
        return(res.status(401).send({
            status:'fail',
            message:'Inavlid Token, Login again'
        }))
    }
    console.log(decoded);

    const result = await client.query(
        `SELECT * FROM student WHERE id = ${decoded.id}`
    );
    console.log(result);
    if(!result){
        return res.status(401).json({
            status: 'fail',
            message: 'The user belonging to this token does no longer exist.',
        });
    }
    req.user = result.rows[0];
    next();
};
const isTeacher = async(req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return res.status(401).json({
            status: 'Unauthorized Access',
            message: 'You are not logged in.',
        });
    }
    // 2. Verification token
    let decoded;
    try{
        console.log(process.env.JWT_SECRET, token);
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch(err){
        return(res.status(401).send({
            status:'fail',
            message:'Inavlid Token, Login again'
        }))
    }
    console.log(decoded);

    const result = await client.query(
        `SELECT * FROM teacher WHERE id = ${decoded.id}`
    );
    if(!result){
        return res.status(401).json({
            status: 'fail',
            message: 'The user belonging to this token does no longer exist.',
        });
    }
    req.user = result.rows[0];
    next();
};

module.exports = {isStudent, isTeacher};