const mongoose = require("mongoose");

/**
 * User Schema
 * 
 * This schema defines the structure of the User model in the database.
 * 
 * Fields:
 * - name: Name of the user (required).
 * - role: Role of the entity (default: "user", immutable).
 * - aadhaar: Aadhaar number of the user (unique, sparse).
 * - email: Email address of the user (required, unique).
 * - password: Password for the user's account (required).
 * - salt: Salt for password hashing.
 * - dateofBirth: Date of birth of the user (under development).
 * - medicalHistory: Array of references to ReportCard documents.
 * 
 * Timestamps: Automatically adds createdAt and updatedAt fields to the document.
 */

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
        immutable: true,
    },
    phoneNumber: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt:{
        type:String,
    },
    dateofBirth: {
        type: Date,
        required: true,
    },
    bloodType: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "N/A"],
        default: "N/A"
    },
    height: {
        type: Number,
        min: 0
    },
    weight: {
        type: Number,
        min: 0
    },
    address: {
        type: String,
    },
    medicalHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReportCard"
    }],
    emergencyProtocol: {
        criticalAllergies: {
            type: String,
            default: ""
        },
        emergencyContact: {
            name: {
                type: String,
                default: ""
            },
            phoneNumber: {
                type: String,
                default: ""
            }
        }
    }
},
{
    timestamps: true
});

const User = mongoose.model("User", userSchema);

// Exporting the User model for use in other files
module.exports = User;