const User = require("../models/user");
const { createHmac, randomBytes } = require("crypto");

async function userSignup(req, res) {
    const { name, email, password } = req.body;
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    try{
        await User.create({
            name,
            email,
            salt: salt,
            password: hashedPassword,
        }); 

        return res.status(201).json({ 
            success: true, 
            message: "user created successfully" 
        });
    }
    catch(err){
        if(err.code === 11000 || (err.code === "MongoError" && err.message.includes('duplicate'))){
            return res.status(400).json({ 
                success: false, 
                message: "user already exists" 
            });
        }

        return res.status(500).json({ 
            success: false, 
            message: "an error occurred while creating user" 
        });
    }
}

async function userLogin(req, res){
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user) 
            return res.status(404).json({ 
                success: false, 
                message: "user not found" 
            });
        const salt = user.salt;
        const hashedpassword = user.password;

        const userProvidedHash = createHmac('sha256', salt)
            .update(password)
            .digest("hex");

        if(hashedpassword !== userProvidedHash) 
            return res.status(401).json({ 
                success: false, 
                message: "password is incorrect" 
            });

        return res.status(200).json({ 
            success: true, 
            message: "user login successfully", 
            user: {
                id: user._id,
                email: user.email
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

async function userDetails(req, res) {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId)?.populate('medicalHistory');

        if(!user){
            return res.status(404).json({
                success: false,
                message: "user not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "user found",
            user: {
                name: user.name,
                email: user.email,
                dateOfBirth: user.dateofBirth ? user.dateofBirth : null,
                medicalHistory: user.medicalHistory
            }
        });
    }
    catch(err){
        return res.status(500).json({ 
            success: false, 
            message: "an error occurred while getting user details" 
        });
    }
}

module.exports = { userSignup, userLogin, userDetails };