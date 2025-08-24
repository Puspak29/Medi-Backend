const mongoose = require("mongoose");

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

module.exports = Doctor;