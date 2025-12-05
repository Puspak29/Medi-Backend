// Importing required modules
const Doctor = require("../models/doctor"); // Doctor model
const { createHmac, randomBytes } = require("crypto"); // Crypto module for hashing and generating random bytes
const jwt = require("jsonwebtoken"); // JWT for token generation
require("dotenv").config(); // Load environment variables from .env file

/**
 * Handles doctor signup by creating a new doctor in the database.
 * The password is hashed with a unique salt before storing.
 * @param {Object} req - Express request object containing doctor details in body.
 * @param {Object} res - Express response object for sending responses.
 * @returns {Object} JSON response for success of failure of doctor signup.
 */
async function doctorSignup(req, res) {
    const { name, email, password, uidByNMC, specialization, experience } = req.body;
    const salt = randomBytes(16).toString('hex'); // Unique salt for hashing
    const hashedPassword = createHmac('sha256', salt) // Hashing the password with salt
        .update(password)
        .digest('hex');

    try{
        // Attempt to create a new doctor
        await Doctor.create({
            name,
            email,
            salt: salt,
            password: hashedPassword,
            uidByNMC,
            specialization,
            experience
        });  

        return res.status(201).json({ 
            success:true, 
            message:"Doctor created successfully" 
        });
    }
    catch(err){
        // Handling duplicate doctor (email) error
        if(err.code === 11000 || (err.code === "MongoError" && err.message.includes('duplicate'))){
            return res.status(400).json({ 
                success: false, 
                message: "Doctor already exists" 
            });
        }

        // Returning server error for any other errors
        return res.status(500).json({ 
            success: false, 
            message: "An error occurred while creating doctor" 
        });
    }
}


/**
 * Handles doctor login by verifying email and password.
 * Verifies the hashed password with the stored hash.
 * @param {Object} req - Express request object containing doctor login details in body.
 * @param {Object} res - Express response object for sending responses.
 * @returns {Object} JSON response for success or failure of doctor login.
 */
async function doctorLogin(req, res){
    try{
        // Attempt to find the doctor by email and verify password
        const { email, password } = req.body;
        const doctor = await Doctor.findOne({ email });
        if(!doctor) // If doctor with given email does not exist
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        const salt = doctor.salt;
        const hashedpassword = doctor.password;

        const doctorProvidedHash = createHmac('sha256', salt)
            .update(password)
            .digest("hex");

        if(hashedpassword !== doctorProvidedHash) // If password does not match
            return res.status(401).json({ 
                success: false, 
                message:"Password is incorrect"
            });

        const accessToken = jwt.sign(
            { id: doctor._id, email: doctor.email, role: doctor.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            success: true, 
            message: "Doctor login successfully", 
            token: accessToken,
            details: {
                id: doctor._id,
                email: doctor.email,
                name: doctor.name,
                role: doctor.role
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

async function getDoctorProfile(req, res){
    try{
        const doctorId = req.user.id;
        const doctor = await Doctor.findById(doctorId);

        if(!doctor){
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Doctor profile fetched successfully",
            doctor: {
                name: doctor.name,
                email: doctor.email,
                uidByNMC: doctor.uidByNMC,
                specialization: doctor.specialization,
                experience: doctor.experience
            }
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "An error occured while getting doctor profile"
        })
    }
}

async function searchDoctors(req, res){
    try{
        const q = req.query.q?.trim() || '';
        if(!q || q.length === 0){
            return res.status(400).json({
                success: false,
                message: "No search query provided"
            })
        }

        const doctors = await Doctor.find({
            name: { $regex: q, $options: 'i' } // Case-insensitive search by name
        }).select('name specialization');

        return res.status(200).json({
            success: true,
            message: "Doctors fetched successfully",
            doctors: doctors
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "An error occurred while searching for doctors"
        });
    }
}

// Exporting the doctor signup and login functions for use in other files
module.exports = { doctorSignup, doctorLogin, getDoctorProfile, searchDoctors };