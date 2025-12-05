// Importing required modules
const express = require("express"); // Express framework for building server
const router = express.Router(); // Creating new router instance
const middleware = require("../middleware");

const { getDoctorProfile } = require("../controllers/doctor"); // User controller functions
const { createAppointment } = require("../controllers/appointment");

router.get("/doctor/profile", middleware, getDoctorProfile);
router.post("/doctor/appointments/create", middleware, createAppointment);

// Exporting the router for use in other files
module.exports = router;