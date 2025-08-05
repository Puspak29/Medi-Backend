const express = require("express");
const { connectMongo } = require("./connections")

require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 8080;
const MongoURI = process.env.MONGO_URI;

connectMongo(MongoURI);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the SERVER!");
})

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
})