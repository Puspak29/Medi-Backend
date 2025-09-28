// Importing required modules
const express = require("express"); // Express framework for building server
const router = express.Router(); // Creating new router instance
const authMiddleware = require("../middleware");

const { generateOtp, verifyOtp } = require("../controllers/reportcard"); // Report card controller functions

router.post("/doctor/reportcard", authMiddleware, generateOtp); // Route to generate OTP for report card (POST /doctor/reportcard)
router.post("/doctor/reportcard/verify", authMiddleware, verifyOtp); // Route to verify OTP for report card (POST /doctor/reportcard/verify)

// Exporting the router for use in other files
module.exports = router;