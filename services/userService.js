const User = require("../models/user");
const Doctor = require("../models/doctor");
const Otp = require("../models/otp");

async function getUserProfileData(userId) {
    const raw = await User.findById(userId).select("medicalHistory");
    if (!raw) return null;
    const totalCount = raw.medicalHistory.length;

    const user = await User.findById(userId)
      .select('-password -salt')
      .populate({
        path: 'medicalHistory',
        options: { sort: { createdAt: -1 }, limit: 3 },
      });
    if (!user) return null;

    const medicalHistory = Array.isArray(user.medicalHistory)
      ? user.medicalHistory
      : [];

    const medicalHistoryCount = totalCount;

    if (medicalHistoryCount === 0) {
      return {
        user,
        medicalHistoryCount,
        latestMedicalHistory: null,
        lastDoctor: null,
        };
    }

    const lastDoctorId = medicalHistory[0]?.doctor || null;
    const lastDoctor = lastDoctorId
      ? await Doctor.findById(lastDoctorId).select('name specialization')
      : null;

    const otps = await Otp.find({ userEmail: user.email }).sort({ createdAt: -1 }).select('-updatedData -updateDataId');
    console.log(user);
    return {
      user,
      medicalHistoryCount,
      latestMedicalHistory: medicalHistory,
      lastDoctor,
      otps,
    };
}

module.exports = { getUserProfileData };
