// Importing required modules
const express = require("express"); // Express framework for building server
const router = express.Router(); // Creating new router instance
const middleware = require("../middleware");

const { getDoctorProfile } = require("../controllers/doctor"); // User controller functions
const { createAppointment, getDoctorAppointments, getAppointedUsers } = require("../controllers/appointment");
const { viewReportCard } = require("../controllers/reportcard");

router.get("/doctor/profile", middleware, getDoctorProfile);
router.post("/doctor/appointments", middleware, createAppointment);
router.get("/doctor/appointments", middleware, getDoctorAppointments);
router.get("/doctor/appointments/view", middleware, getAppointedUsers);
router.get("/doctor/viewreport", middleware, viewReportCard);

// Exporting the router for use in other files
module.exports = router;