const mongoose = require("mongoose");

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
    aadhaar: {
        type: Number,
        unique: true,
        sparse: true,
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
    },
    medicalHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReportCard"
    }]
},
{
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;