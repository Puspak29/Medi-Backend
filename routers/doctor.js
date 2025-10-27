// Importing required modules
const express = require("express"); // Express framework for building server
const router = express.Router(); // Creating new router instance
const middleware = require("../middleware");

const { getDoctorProfile } = require("../controllers/doctor"); // User controller functions

router.get("/doctor/profile", middleware, getDoctorProfile);

// Exporting the router for use in other files
module.exports = router;