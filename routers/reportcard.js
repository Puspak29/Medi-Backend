const express = require("express");
const router = express.Router();

const { generateOtp, verifyOtp } = require("../controllers/reportcard");

router.post("/doctor/reportcard", generateOtp);
router.post("/doctor/reportcard/verify", verifyOtp);

module.exports = router;