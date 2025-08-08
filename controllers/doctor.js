const Doctor = require("../models/doctor");
const { createHmac, randomBytes } = require("crypto");

async function doctorSignup(req, res) {
    const { name, email, password } = req.body;
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt)
        .update(password)
        .digest('hex');
    await Doctor.create({
        name,
        email,
        salt: salt,
        password: hashedPassword,
    });  

    return res.json({ success:true, message:"Doctor created successfully" });
}

async  function doctorLogin(req, res){
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if(!doctor) return res.json({error: "Doctor not found"});
    const salt =doctor.salt;
    const hashedpassword = doctor.password;

    const doctorProvidedHash = createHmac('sha256', salt)
        .update(password)
        .digest("hex")

    if (hashedpassword !== doctorProvidedHash) return res.json({ success: false, message:"Password is incorrect"});
    return res.json({success: true, message: "Doctor login successfully", Doctor: doctor});
}

module.exports = { doctorSignup, doctorLogin };