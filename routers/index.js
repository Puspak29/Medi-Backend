const express = require("express");
const router = express.Router();

const authRouter = require("./auth");

router.get("/", (req, res) => {
    res.send("Welcome to the SERVER!");
});

router.use("/api/auth", authRouter);

module.exports = router;