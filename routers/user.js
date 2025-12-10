// Importing required modules
const express = require("express"); // Express framework for building server
const router = express.Router(); // Creating new router instance
const middleware = require("../middleware");

const { getUserReportCard } = require("../controllers/user"); // User controller functions
const { searchDoctors } = require("../controllers/doctor");
const { bookSlot, getAvailableSlots, getUserAppointments } = require("../controllers/appointment");

router.get("/user/reportcards", middleware, getUserReportCard); // Route to get user report card (GET /user/reportcard)
router.get("/user/appointments", middleware, getUserAppointments);
router.get("/user/appointments/search", middleware, searchDoctors); // Route to get user appointments (GET /user/appointments)
router.post("/user/appointments/book", middleware, bookSlot);
router.get("/user/appointments/book", middleware, getAvailableSlots);

// Exporting the router for use in other files
module.exports = router;