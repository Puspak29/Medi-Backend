// Importing required modules
const express = require("express"); // Express framework for building server
const router = express.Router(); // Creating new router instance
const middleware = require("../middleware");

const { userDetails, getUserProfile } = require("../controllers/user"); // User controller functions

router.get("/user/profile", middleware, getUserProfile);
router.get("/user/:id", userDetails); // Route to get user details (GET /user/:id)

// Exporting the router for use in other files
module.exports = router;