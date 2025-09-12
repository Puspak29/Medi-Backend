// Importing required modules
const express = require("express"); // Express framework for building server
const router = express.Router(); // Creating new router instance

const { userSignup, userLogin } = require("../controllers/user"); // User controller functions
const { doctorSignup, doctorLogin } = require("../controllers/doctor"); // Doctor controller functions


// Setting up routes for user and doctor signup and login
router.post("/user/signup", userSignup); // User signup route (POST /user/signup)
router.post("/user/login", userLogin); // User login route (POST /user/login)
router.post("/doctor/signup", doctorSignup); // Doctor signup route (POST /doctor/signup)
router.post("/doctor/login", doctorLogin); // Doctor login route (POST /doctor/login)

// Exporting the router for use in other files
module.exports = router;