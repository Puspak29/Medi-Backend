// Importing required modules
const express = require("express"); // Express framework for building server
const router = express.Router(); // Creating new router instance

const authRouter = require("./auth"); // Authentication routes
const reportCardRouter = require("./reportcard"); // Report card routes
const userRouter = require("./user"); // User routes
const doctorRouter = require("./doctor"); // Doctor routes

// Root route (GET /)
router.get("/", (req, res) => {
    res.send("Welcome to the SERVER!");
});

router.use("/api/auth", authRouter); // Using auth routes for /api/auth
router.use("/api", reportCardRouter); // Using report card routes for /api
router.use("/api", userRouter); // Using user routes for /api
router.use("/api", doctorRouter); // Using doctor routes for /api

// Exporting the router for use in other files
module.exports = router;