const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const reportCardRouter = require("./reportcard");

router.get("/", (req, res) => {
    res.send("Welcome to the SERVER!");
});

router.use("/api/auth", authRouter);
router.use("/api", reportCardRouter);

module.exports = router;