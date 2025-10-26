const Doctor = require("../models/user");
const Badge = require("../models/badges");

async function getDoctorProfileData(doctorId) {
    const doctor = await Doctor.findById(doctorId).select('-password -salt');
    if(!doctor) throw new Error('Doctor not found');
    return doctor;
}

async function badgeAssignment(doctorId){
    const doctor = await Doctor.findById(doctorId).populate('badges.badge').select('-password -salt');
    if(!doctor) throw new Error('Doctor not found');

    const allBadges = await Badge.find();

    const earnedBadgeIds = doctor.badges.map(b => b.badge._id.toString());
    const newBadges = [];

    for(const badge of allBadges){
        let qualified = false;
        qualified = doctor[badge.conditionType] >= badge.threshold;
        if(qualified && !earnedBadgeIds.includes(badge._id.toString())){
            doctor.badges.push({ badge: badge._id, earnedAt: new Date() });
            newBadges.push(badge);
        }
    }
    if (newBadges.length > 0) {
        await doctor.save();
    }

    return newBadges;

}

module.exports = { getDoctorProfileData, badgeAssignment };
