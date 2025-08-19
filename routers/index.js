const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const reportCardRouter = require("./reportcard");
const userRouter = require("./user");

router.get("/", (req, res) => {
    res.send("Welcome to the SERVER!");
});

router.use("/api/auth", authRouter);
router.use("/api", reportCardRouter);
router.use("/api", userRouter);

module.exports = router;