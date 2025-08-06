const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    aadhaar: {
        type: Number,
        unique: true,
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
        type:String,
    },
    dateofBirth: {
        type: Date,
    },
    medicalHistory: [{
        condition: {
            type: String,
        },
        description: {
            type: String,
        },
        treatment: {
            type: String,
        },
        doctor: {
            type: String,
        },
        date: {
            type: Date,
        },
        supportingDocument: {
            type: String,
        }
    }]
},
{
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;