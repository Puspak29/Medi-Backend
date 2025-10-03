const User = require("../models/user");
const { createHmac, randomBytes } = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Handles user signup.
 * Password is hashed with a unique salt before storing.
 * @param {Object} req - Express request object containing user details in body.
 * @param {Object} res - Express response object for sending responses.
 * @returns {Object} JSON response for success or failure of user signup.
 */
async function userSignup(req, res) {
    const { name, email, password, dateofBirth, aadhaar } = req.body;
    const salt = randomBytes(16).toString('hex'); // Unique salt for hashing
    const hashedPassword = createHmac('sha256', salt) // Hashing the password with salt
        .update(password)
        .digest('hex');

    try{
        // Attempt to create a new user
        await User.create({
            name,
            aadhaar,
            email,
            salt: salt,
            password: hashedPassword,
            dateofBirth,
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
            user: {
                id: user._id,
                email: user.email
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


/**
 * Handles user details retrieval.
 * @param {Object} req - Express request object containing user ID in params.
 * @param {Object} res - Express response object for sending responses.
 * @returns {Object} JSON response for success or failure of user details retrieval.
 */
async function userDetails(req, res) {
    try{
        // Attempt to find the user by ID and populate medical history
        const userId = req.params.id;
        const user = await User.findById(userId)?.populate('medicalHistory');

        if(!user){ // If user with given ID does not exist
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User found",
            user: {
                name: user.name,
                email: user.email,
                dateOfBirth: user.dateofBirth ? user.dateofBirth : null,
                medicalHistory: user.medicalHistory
            }
        });
    }
    catch(err){
        // Returning server error for any other errors
        return res.status(500).json({ 
            success: false, 
            message: "An error occurred while getting user details" 
        });
    }
}

async function getUserProfile(req, res){
    try{
        const userId = req.user.id;
        const user = await User.findById(userId)?.populate('medicalHistory');

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            user: {
                name: user.name,
                email: user.email,
                aadhaar: user.aadhaar,
                dateofBirth: user.dateofBirth ? user.dateofBirth : null,
                medicalHistory: user.medicalHistory
            }
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "An error occured while getting user profile"
        })
    }
}

// Exporting the user handling functions for use in other files
module.exports = { userSignup, userLogin, userDetails, getUserProfile };