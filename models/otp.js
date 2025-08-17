const mongoose = require("mongoose");

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

otpSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;