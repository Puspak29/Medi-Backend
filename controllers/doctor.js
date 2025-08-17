const Doctor = require("../models/doctor");
const { createHmac, randomBytes } = require("crypto");

async function doctorSignup(req, res) {
    const { name, email, password } = req.body;
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    try{
        await Doctor.create({
            name,
            email,
            salt: salt,
            password: hashedPassword,
        });  

        return res.status(201).json({ 
            success:true, 
            message:"doctor created successfully" 
        });
    }
    catch(err){
        if(err.code === 11000 || (err.code === "MongoError" && err.message.includes('duplicate'))){
            return res.status(400).json({ 
                success: false, 
                message: "doctor already exists" 
            });
        }

        return res.status(500).json({ 
            success: false, 
            message: "an error occurred while creating doctor" 
        });
    }
}

async  function doctorLogin(req, res){
    try{
        const { email, password } = req.body;
        const doctor = await Doctor.findOne({ email });
        if(!doctor) 
            return res.status(404).json({
                success: false,
                message: "doctor not found"
            });
        const salt = doctor.salt;
        const hashedpassword = doctor.password;

        const doctorProvidedHash = createHmac('sha256', salt)
            .update(password)
            .digest("hex");

        if(hashedpassword !== doctorProvidedHash) 
            return res.status(401).json({ 
                success: false, 
                message:"password is incorrect"
            });

        return res.status(200).json({
            success: true, 
            message: "doctor login successfully", 
            doctor: {
                id: doctor._id,
                email: doctor.email
            }
        });
    }
    catch(err){
        return res.status(500).json({ 
            success: false, 
            message: "an error occurred while logging in" 
        });
    }
}

module.exports = { doctorSignup, doctorLogin };