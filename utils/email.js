const nodemailer = require('nodemailer');

const sendEmail = async function(options){
    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "a8917049ae1cd9",
            pass: "2a13d2d070bfaf"
        }
    });

    // 2. Define the email options
    const mailOptions = {
        from:'Gulshan Kumar <gulshan.k20@iiits.in>',
        to:options.email,
        subject:options.subjcet,
        text:options.message
    }

    // 3. send the email with nodemailer
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;