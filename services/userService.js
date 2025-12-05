const User = require("../models/user");
const Doctor = require("../models/doctor");

async function getUserProfileData(userId) {
    const raw = await User.findById(userId).select("medicalHistory");
    if (!raw) throw new Error("User not found");
    const totalCount = raw.medicalHistory.length;

    const user = await User.findById(userId)
      .select('-password -salt')
      .populate({
        path: 'medicalHistory',
        options: { sort: { createdAt: -1 }, limit: 3 },
      });
    if (!user) throw new Error('User not found');

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
    return {
      user,
      medicalHistoryCount,
      latestMedicalHistory: medicalHistory,
      lastDoctor,
    };
}

module.exports = { getUserProfileData };
