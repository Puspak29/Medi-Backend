const { getDoctorProfileData } = require('../services/doctorService');
const { getUserProfileData } = require('../services/userService');

async function checkAuth(req, res){
    try{
        const { id, email, role } = req.user;
        
        if(role === 'user'){
            const user = await getUserProfileData(id);
            return res.status(200).json({
                success: true,
                message: "Authentication valid",
                details: {
                    id,
                    email,
                    role,
                    name: user.user.name,
                    phoneNumber: user.user.phoneNumber,
                    dateofBirth: user.user.dateofBirth,
                    address: user.user.address,
                    medicalHistoryCount: user.medicalHistoryCount,
                    latestMedicalHistory: user.latestMedicalHistory || [],
                    createdAt: user.user.createdAt,
                    lastDoctor: user.lastDoctor,
                    notification: user.otps || [],
                    bloodType: user.user.bloodType,
                    height: user.user.height,
                    weight: user.user.weight,
                    emergencyProtocol: user.user.emergencyProtocol
                }
            });
        }

        const doctor = await getDoctorProfileData(id);
        const additionalExp = new Date().getFullYear() - doctor.doctor.createdAt.getFullYear();
        return res.status(200).json({
            success: true,
            message: "Authentication valid",
            details: {
                id,
                email,
                role,
                name: doctor.doctor.name,
                specialization: doctor.doctor.specialization,
                experience: doctor.doctor.experience + additionalExp,
                uidByNMC: doctor.doctor.uidByNMC,
                phoneNumber: doctor.doctor.phoneNumber,
                address: doctor.doctor.address,
                patientCount: doctor.patientCount,
                rating: doctor.doctor.rating,
                createdAt: doctor.doctor.createdAt,
                lastPatient: doctor.lastPatient,
                latestMedicalHistory: doctor.latestMedicalHistory || [],
                hospitalAffiliation: doctor.doctor.hospitalAffiliation,
                bio: doctor.doctor.bio,
                badges: doctor.doctor.badges || []
            }
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "An error occured while checking authentication"
        })
    }
}

module.exports = checkAuth;