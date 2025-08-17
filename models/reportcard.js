const mongoose = require("mongoose");

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

reportCardSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ReportCard = mongoose.model("ReportCard", reportCardSchema);

module.exports = ReportCard;