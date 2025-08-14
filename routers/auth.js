const express = require("express");
const router = express.Router();

const { userSignup, userLogin } = require("../controllers/user");
const { doctorSignup, doctorLogin } = require("../controllers/doctor");


router.post("/user/signup", userSignup);
router.post("/user/login", userLogin);
router.post("/doctor/signup", doctorSignup);
router.post("/doctor/login", doctorLogin);

module.exports = router;