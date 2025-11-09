const mongoose = require("mongoose");

/**
 * ReportCard Schema
 * 
 * This schema defines the structure of the ReportCard model in the database.
 * 
 * Fields:
 * - user: Reference to the User model (required).
 * - doctor: Reference to the Doctor model (required).
 * - condition: Medical condition of the user (under development).
 * - description: Description of the medical condition (under development).
 * - treatment: Treatment prescribed for the condition (under development).
 * - date: Date of the report card (default: current date).
 * - supportingDocument: URL or path to any supporting document (under development).
 * - isVerified: Boolean indicating if the report card is verified through OTP (default: false).
 * - expiresAt: Date when the report card expires (default: 24 hours from creation).
 * 
 * Timestamps: Automatically adds createdAt and updatedAt fields to the document.
 */

const reportCardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
    },
    condition: {
        type: String,
    },
    description: {
        type: String,
    },
    treatment: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["Normal", "Critical", "Attention Needed", "Under Review"],
        default: "Normal"
    },
    supportingDocument: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        default: () => Date.now() + 24 * 60 * 60 * 1000
    }
},{
    timestamps: true
});

// Index to automatically delete expired report cards
reportCardSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ReportCard = mongoose.model("ReportCard", reportCardSchema);

// Exporting the ReportCard model for use in other files
module.exports = ReportCard;