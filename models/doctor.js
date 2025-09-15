const mongoose = require("mongoose");

/**
 * Doctor Schema
 * 
 * This schema defines the structure of the Doctor model in the database.
 * 
 * Fields:
 * - name: Name of the doctor (required).
 * - role: Role of the entity (default: "doctor", immutable).
 * - uidByNMC: Unique identifier assigned by the National Medical commition (under development).
 * - email: Email address of the doctor (required, unique).
 * - password: Password for the doctor's account (required).
 * - salt: Salt for password hashing.
 * - specialization: Specialization of the doctor (e.g. cardiology, neurology).
 * - experience: Years of experience the doctor has in their field (optional).
 * 
 * Timestamps: Automatically adds createdAt and updatedAt fields to the document.
 */

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "doctor",
        immutable: true
    },
    uidByNMC: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    salt:{
        type :String,
    },
    specialization: {
        type: String,
    },
    experience: {
        type: Number,
    }
},
{
    timestamps: true
});

const Doctor = mongoose.model("Doctor", doctorSchema);

// Exporting the Doctor model for use in other files
module.exports = Doctor;