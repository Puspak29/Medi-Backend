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
    },
    supportingDocument: {
        type: String,
    }
},{
    timestamps: true
});

const ReportCard = mongoose.model("ReportCard", reportCardSchema);

module.exports = ReportCard;