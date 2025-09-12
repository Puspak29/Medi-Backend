// Importing require modules
const transporter = require("../config/gmail"); // Gmail transporter configuration

require("dotenv").config(); // Load environment variable from .env

/**
 * Asynchronously sends an OTP email to the specified recipient.
 * @param {string} to - The recipient's email address.
 * @param {string} otp - The OTP to be sent.
 */
async function sendOtpEmail(to, otp){
    // Email options
    const mailOptions = {
        from: `"Your OTP" <${process.env.GMAIL_USER}>`,
        to,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    }

    try{
        // Attempt to send the email
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    }
    catch(err){
        // Log any errors during email sending
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
        // Attempt to send the email
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    }
    catch(err){
        // Log any errors during email sending
        console.error("Error sending email:", err);
    }
}

// Exporting the email sending functions for use in other files
module.exports = {
    sendOtpEmail,
    sendSuccessEmail,
}