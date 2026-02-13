const Doctor = require("../models/doctor");
const Badge = require("../models/badges");
const ReportCard = require("../models/reportcard");
const User = require("../models/user");

async function getDoctorProfileData(doctorId) {
    const doctor = await Doctor.findById(doctorId).select('-password -salt').populate('badges.badge');
    if(!doctor) return null;

    await badgeAssignment(doctor);
    await doctor.populate('badges.badge');

    const patients = await ReportCard.distinct('user', { doctor: doctorId, isVerified: true });
    const patientCount = patients.length;
    const doc = await ReportCard.find({ doctor: doctorId, isVerified: true }).sort({ createdAt: -1 }).limit(3);

    const lastPatient = doc ? await User.findById(doc[0]?.user).select('name') : null;
    return { 
        doctor, 
        patientCount, 
        lastPatient ,
        latestMedicalHistory: doc ? doc : []
    };
}

async function badgeAssignment(doctor){
    const badges = await Badge.find();
    for(const badge of badges){
        if(doctor[badge.conditionType] >= badge.threshold && !doctor.badges.some(b => b.badge._id.equals(badge._id))){
            doctor.badges.push({ badge: badge._id, earnedAt: new Date() });
        }
    }
    await doctor.save();
}

module.exports = { getDoctorProfileData, badgeAssignment };
