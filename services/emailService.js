const transporter = require("../config/gmail");

require("dotenv").config();

async function sendOtpEmail(to, otp){
    const mailOptions = {
        from: `"Your OTP" <${process.env.GMAIL_USER}>`,
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
        from: `"Successful" <${process.env.GMAIL_USER}>`,
        to,
        subject: "Success",
        text: `Your ${message} was successful.`,
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