const crypto = require("crypto");
const User = require("../models/user");
const ReportCard = require("../models/reportcard");
const Otp = require("../models/otp");

async function generateOtp(req, res){
    const { userEmail, otpType, description } = req.body;

    try{
        const user = await User.findOne({ email: userEmail });
        if(!user){
            return res.status(404).json({
                success: false,
                message: "user not found"
            });
        }

        const generatedOtp = crypto.randomInt(100000, 999999).toString();

        const newReportCard = await ReportCard.create({
            user: user._id,
            description: description
        });

        await Otp.create({
            userEmail,
            otp: generatedOtp,
            otpExpires: new Date(Date.now() + 5 * 60 * 1000),
            otpType,
            updateDataId: newReportCard._id
        });

        console.log(`OTP for ${userEmail} is ${generatedOtp}`);

        return res.status(200).json({
            success: true,
            message: "otp generated successfully"
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "an error occurred while generating otp"
        });
    }
}

async function verifyOtp(req, res){
    const { userEmail, otp, otpType } = req.body;

    try{
        const otpRecord = await Otp.findOne({ 
            userEmail, 
            otp,
            otpType
        });

        if(!otpRecord || otpRecord.otpExpires < Date.now()){
            return res.status(401).json({
                success: false,
                message: "invalid otp"
            });
        }

        const updatedUser = await User.findOneAndUpdate(
            { email: userEmail },
            {
                $push: {
                    medicalHistory: otpRecord.updateDataId
                }
            },
            { new: true }
        );

        const updatedReportCard = await ReportCard.findByIdAndUpdate(
            otpRecord.updateDataId,
            {
                isVerified: true,
                expiresAt: null
            },
            { new: true }
        );

        await Otp.deleteOne({ _id: otpRecord._id });

        return res.status(200).json({
            success: true,
            message: "reportcard successfully added"
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "an error occurred while verifying otp"
        });
    }
}

module.exports = {
    generateOtp,
    verifyOtp
}