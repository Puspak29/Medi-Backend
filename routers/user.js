// Importing required modules
const express = require("express"); // Express framework for building server
const router = express.Router(); // Creating new router instance
const middleware = require("../middleware");

const { getUserReportCard } = require("../controllers/user"); // User controller functions
const { searchDoctors } = require("../controllers/doctor");
const { bookSlot } = require("../controllers/appointment");

router.get("/user/reportcards", middleware, getUserReportCard); // Route to get user report card (GET /user/reportcard)
router.get("/user/appointments", middleware, searchDoctors); // Route to get user appointments (GET /user/appointments)
router.post("/user/appointments/book", middleware, bookSlot);

// Exporting the router for use in other files
module.exports = router;