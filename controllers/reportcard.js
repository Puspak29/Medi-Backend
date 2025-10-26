const crypto = require("crypto");
const User = require("../models/user");
const ReportCard = require("../models/reportcard");
const Otp = require("../models/otp");
const { sendOtpEmail, sendSuccessEmail } = require("../services/emailService");

/**
 * Handles OTP generation for user actions.
 * Generates a 6-digit OTP, creates a report card entry, and sends the OTP via email.
 * @param {Object} req - Express request object containing user email and OTP details in body.
 * @param {Object} res - Express response object for sending responses.
 * @returns {Object} JSON response for success or failure of OTP generation.
 */
async function generateOtp(req, res){
    const { doctorId, userEmail, otpType, condition, treatment, description, date, supportingDocument } = req.body;

    try{
        // Attempt to find the user by email and generate OTP if user exists then create report card and send email
        const user = await User.findOne({ email: userEmail });
        if(!user){ // If user with given email does not exist
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const generatedOtp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP

        const newReportCard = await ReportCard.create({
            user: user._id,
            doctor: doctorId,
            condition: condition,
            treatment: treatment,
            description: description,
            date: date,
            supportingDocument: supportingDocument
        });

        await Otp.create({
            userEmail,
            otp: generatedOtp,
            otpExpires: new Date(Date.now() + 5 * 60 * 1000), // OTP expires in 5 minutes
            otpType,
            updateDataId: newReportCard._id
        });

        await sendOtpEmail(userEmail, generatedOtp); // Send the OTP email

        return res.status(200).json({
            success: true,
            message: "OTP generated successfully"
        });
    }
    catch(err){
        // Returning server error for any other errors
        return res.status(500).json({
            success: false,
            message: "An error occurred while generating OTP"
        });
    }
}

/**
 * Handles OTP verification for user actions.
 * Verifies the provided OTP against the stored OTP for the user.
 * @param {Object} req - Express request object containing user email and OTP details in body.
 * @param {Object} res - Express response object for sending responses.
 * @returns {Object} JSON response for success or failure of OTP verification.
 */
async function verifyOtp(req, res){
    const { userEmail, otp, otpType } = req.body;

    try{
        const otpRecord = await Otp.findOne({ 
            userEmail, 
            otp,
            otpType
        });

        if(!otpRecord || otpRecord.otpExpires < Date.now()){ // If OTP record does not exist or OTP has expired
            return res.status(401).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        const updatedUser = await User.findOneAndUpdate( // Add report card to user's medical history
            { email: userEmail },
            {
                $push: {
                    medicalHistory: otpRecord.updateDataId
                }
            },
            { new: true }
        );

        const updatedReportCard = await ReportCard.findByIdAndUpdate( // Mark report card as verified and remove expiration
            otpRecord.updateDataId,
            {
                isVerified: true,
                $unset: { expiresAt: "" }
            },
            { new: true }
        );

        await sendSuccessEmail(userEmail, otpType); // Send success email
        await Otp.deleteOne({ _id: otpRecord._id }); // Delete the OTP record after successful verification

        return res.status(200).json({
            success: true,
            message: "Reportcard successfully added"
        });
    }
    catch(err){
        // Returning server error for any other errors
        return res.status(500).json({
            success: false,
            message: "An error occurred while verifying OTP"
        });
    }
}

// Exporting the OTP generation and verification functions for use in other files
module.exports = {
    generateOtp,
    verifyOtp
}