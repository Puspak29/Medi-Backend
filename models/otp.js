const mongoose = require("mongoose");

/**
 * OTP Schema
 *
 * This schema defines the structure of the OTP model in the database.
 * 
 * Fields:
 * - userEmail: Email address of the user for whom the OTP is generated (required).
 * - otp: The OTP value (required).
 * - otpExpires: The expiration date and time of the OTP (required).
 * - otpType: Type of OTP e.g. "update", "password-reset", "login" (required).
 * - updatedData: Additional data that may be updated (under development).
 * - updatedDataId: Reference to the ReportCard model.
 */

const otpSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    otpExpires: {
        type: Date,
        required: true
    },
    otpType: {
        type: String,
        enum: ["update", "password-reset", "login"],
        required: true
    },
    updatedData: {
        type: String,
    },
    updateDataId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReportCard"
    }
});

// Index to automatically delete expired OTPs
otpSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model("Otp", otpSchema);

// Exporting the Otp model for use in other files
module.exports = Otp;