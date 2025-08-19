const express = require("express");
const router = express.Router();

const { userDetails } = require("../controllers/user");

router.get("/user/:id", userDetails);

module.exports = router;