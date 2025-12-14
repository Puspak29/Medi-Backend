const transporter = require("../config/gmail");

require("dotenv").config();

/**
 * Asynchronously sends an OTP email to the specified recipient.
 * @param {string} to - The recipient's email address.
 * @param {string} otp - The OTP to be sent.
 */
async function sendOtpEmail(to, otp){
    const mailOptions = {
        from: `"Your OTP" <${process.env.GMAIL_USER}>`,
        to,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    }

    try{
        await transporter.sendMail(mailOptions);
    }
    catch(err){
        console.error("Error sending email:", err);
    }
}

/**
 * Asynchronusly sends a success email to the specified recipient.
 * @param {string} to - The recipient's email address.
 * @param {string} message - The type of task that was successful.
 */
async function sendSuccessEmail(to, message){
    // Email options
    const mailOptions = {
        from: `"Successful" <${process.env.GMAIL_USER}>`,
        to,
        subject: "Success",
        text: `Your ${message} was successful.`,
    }

    try{
        await transporter.sendMail(mailOptions);
    }
    catch(err){
        console.error("Error sending email:", err);
    }
}

module.exports = {
    sendOtpEmail,
    sendSuccessEmail,
}