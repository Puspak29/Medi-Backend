const Doctor = require("../models/doctor");
const Badge = require("../models/badges");
const ReportCard = require("../models/reportcard");
const User = require("../models/user");

async function getDoctorProfileData(doctorId) {
    const doctor = await Doctor.findById(doctorId).select('-password -salt -badges');
    if(!doctor) return null;

    const patients = await ReportCard.distinct('user', { doctor: doctorId });
    const patientCount = patients.length;
    const doc = await ReportCard.find({ doctor: doctorId }).sort({ createdAt: -1 }).limit(3);

    const lastPatient = doc ? await User.findById(doc[0]?.user).select('name') : null;
    return { 
        doctor, 
        patientCount, 
        lastPatient ,
        latestMedicalHistory: doc ? doc : []
    };
}

async function badgeAssignment(doctorId){
    const doctor = await Doctor.findById(doctorId).populate('badges.badge').select('-password -salt');
    if(!doctor) return null;

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
