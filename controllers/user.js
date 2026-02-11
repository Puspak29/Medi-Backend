const User = require("../models/user");
const { createHmac, randomBytes } = require("crypto");
const jwt = require("jsonwebtoken");
const { getUserProfileData } = require("../services/userService")
require("dotenv").config();

/**
 * Handles user signup.
 * Password is hashed with a unique salt before storing.
 * @param {Object} req - Express request object containing user details in body.
 * @param {Object} res - Express response object for sending responses.
 * @returns {Object} JSON response for success or failure of user signup.
 */
async function userSignup(req, res) {
    const { name, email, password, dateofBirth, phoneNumber, address } = req.body;
    const salt = randomBytes(16).toString('hex'); // Unique salt for hashing
    const hashedPassword = createHmac('sha256', salt) // Hashing the password with salt
        .update(password)
        .digest('hex');

    try{
        // Attempt to create a new user
        await User.create({
            name,
            phoneNumber,
            email,
            salt: salt,
            password: hashedPassword,
            dateofBirth,
            address
        }); 

        return res.status(201).json({ 
            success: true, 
            message: "User created successfully" 
        });
    }
    catch(err){
        // Handling duplicate user (email) error
        if(err.code === 11000 || (err.code === "MongoError" && err.message.includes('duplicate'))){
            return res.status(400).json({ 
                success: false, 
                message: "User already exists" 
            });
        }

        // Returning server error for any other errors
        return res.status(500).json({ 
            success: false, 
            message: "An error occurred while creating user" 
        });
    }
}

/**
 * Handles user login.
 * Verifies the hashed password with the stored hash.
 * @param {Object} req - Express request object containing user email and password in body.
 * @param {Object} res - Express response object for sending responses.
 * @returns {Object} JSON response for success or failure of user login.
 */
async function userLogin(req, res){
    try{
        // Attempt to find the user by email and verify password
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user) // If user with given email does not exist
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        const salt = user.salt;
        const hashedpassword = user.password;

        const userProvidedHash = createHmac('sha256', salt)
            .update(password)
            .digest("hex");

        if(hashedpassword !== userProvidedHash) // If password does not match
            return res.status(401).json({ 
                success: false, 
                message: "Password is incorrect" 
            });

        const accessToken = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({ 
            success: true, 
            message: "User login successfully", 
            token: accessToken,
            details: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            } 
        });
    }
    catch(err){
        // Returning server error for any other errors
        return res.status(500).json({ 
            success: false, 
            message: "An error occurred while logging in" 
        });
    }
    
}

async function getUserReportCard(req, res){
    try{
        const userId = req.user.id;
        const user = await User.findById(userId)?.populate({
            path: 'medicalHistory',
            options: { sort: { createdAt: -1 }}
        }).select('medicalHistory');

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            medicalHistory: user.medicalHistory
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "An error occured while getting user profile"
        })
    }
}

async function updateUserProfile(req, res){
    try{
        const userId = req.user.id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { bloodType, height, weight, address, emergencyProtocol } = req.body;

        user.bloodType = bloodType || user.bloodType;
        user.height = height || user.height;
        user.weight = weight || user.weight;
        user.address = address || user.address;
        user.emergencyProtocol = emergencyProtocol || user.emergencyProtocol;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User profile updated successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "An error occured while updating profile"
        })
    }
}

// Exporting the user handling functions for use in other files
module.exports = { userSignup, userLogin, getUserReportCard, updateUserProfile };