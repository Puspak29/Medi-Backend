const transporter = require("../config/email");

require("dotenv").config();

async function sendOtpEmail(to, otp){
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    }

    try{
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    }
    catch(err){
        console.error("Error sending email:", err);
    }
}

async function sendSuccessEmail(to, message){
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject: "Success",
        text: `${message} successful.`,
    }

    try{
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    }
    catch(err){
        console.error("Error sending email:", err);
    }
}

module.exports = {
    sendOtpEmail,
    sendSuccessEmail,
}