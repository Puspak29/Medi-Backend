const express = require("express"); 
const router = express.Router(); 
const middleware = require("../middleware");

const { getUserReportCard, updateUserProfile } = require("../controllers/user");
const { searchDoctors } = require("../controllers/doctor");
const { bookSlot, getAvailableSlots, getUserAppointments } = require("../controllers/appointment");
const { viewReportCard } = require("../controllers/reportcard");

router.get("/user/reportcards", middleware, getUserReportCard); // Route to get user report card (GET /user/reportcard)
router.get("/user/appointments", middleware, getUserAppointments);
router.get("/user/appointments/search", middleware, searchDoctors); // Route to get user appointments (GET /user/appointments)
router.post("/user/appointments/book", middleware, bookSlot);
router.get("/user/appointments/book", middleware, getAvailableSlots);
router.get("/user/viewreport", middleware, viewReportCard);
router.post("/user/profile/update", middleware, updateUserProfile);

module.exports = router;