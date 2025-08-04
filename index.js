const express = require("express");

const app = express();
const PORT = 8080;

app.get("/", (req, res) => {
    res.send("Welcome to the SERVER!");
})

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
})