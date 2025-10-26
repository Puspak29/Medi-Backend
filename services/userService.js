const User = require("../models/user");

async function getUserProfileData(userId) {
    const user = await User.findById(userId).select('-password -salt');
    if (!user) throw new Error('User not found');

    const medicalHistoryCount = user.medicalHistory.length;
    const latestMedicalHistory = await User.findById(userId).populate({
        path: 'medicalHistory',
        options: { sort: { createdAt: -1 }, 
        limit: 3 
        }
    }).select('medicalHistory -_id');
    return { user, medicalHistoryCount, latestMedicalHistory };
}

module.exports = { getUserProfileData };
