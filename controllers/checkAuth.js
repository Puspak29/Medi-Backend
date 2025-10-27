const { getUserProfileData } = require('../services/userService')

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
                    aadhaar: user.user.aadhaar,
                    dateofBirth: user.user.dateofBirth,
                    medicalHistoryCount: user.medicalHistoryCount,
                    latestMedicalHistory: user.latestMedicalHistory
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Authentication valid",
            details: {
                id,
                email,
                role
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